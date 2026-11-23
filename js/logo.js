(function () {
  "use strict";

  var mark = window.TOMI_MARK;
  var activity = window.TOMI_LOGO_ACTIVITY;
  var svg = document.getElementById("living-mark");
  if (!mark || !activity || !svg || !mark.paths || mark.paths.length !== 2) return;

  var NS = "http://www.w3.org/2000/svg";
  var livePath = document.getElementById("mark-live");
  var ghostPath = document.getElementById("mark-ghost");
  var toggleButton = document.querySelector('[data-action="toggle"]');
  var ghostButton = document.querySelector('[data-action="ghost"]');
  var nudgeButton = document.querySelector('[data-action="nudge"]');
  var ampInput = document.querySelector("[data-amp]");
  var ampOutput = document.querySelector("[data-amp-value]");
  var statusText = document.querySelector("[data-status]");
  var modeNote = document.querySelector("[data-mode-note]");
  var liveLabel = document.querySelector("[data-live-label]");
  var legend = document.querySelector("[data-legend]");
  var motionButtons = Array.prototype.slice.call(document.querySelectorAll("[data-motion]"));
  var statElements = {
    commits: document.querySelector('[data-stat="commits"]'),
    repos: document.querySelector('[data-stat="repos"]'),
    last: document.querySelector('[data-stat="last"]'),
    source: document.querySelector('[data-stat="source"]')
  };

  var viewBox = mark.viewBox.split(/\s+/).map(Number);
  var cx = viewBox[0] + viewBox[2] / 2;
  var cy = viewBox[1] + viewBox[3] / 2;
  var size = Math.max(viewBox[2], viewBox[3]);

  var MOTION_KEY = "tomi-logo-motion";
  var REVEAL_DURATION = 700;
  var RIPPLE_DURATION = 2200;
  var NUDGE_DURATION = 1600;

  var MODE_NOTES = {
    still: "Still. Recent public events leave small dents in the outline. Nothing moves between updates.",
    ripple: "Ripple. One smooth wave travels around the mark when a new event lands.",
    pulse: "Pulse. A slow breath that calms down the longer it's been since my last public event."
  };
  var MODES = ["still", "ripple", "pulse"];

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var playing = !motionQuery.matches;
  var ampScale = 1;
  var clock = 0;
  var lastFrame = 0;
  var frameId = null;
  var mode = "still";

  var dents = [];
  var tempDents = [];
  var dentRevealStart = null;
  var ripple = null;
  var pulseBoost = 0;
  var pulseAmp = 0.01;
  var pulseSpeed = 0.7;
  var pulsePhase = Math.random() * Math.PI * 2;

  var dataSource = "loading";
  var statusMessage = "Checking for activity…";
  var samples = [];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function circularDistance(a, b) {
    var distance = Math.abs(a - b);
    return distance > 0.5 ? 1 - distance : distance;
  }

  function gaussian(distance, width) {
    if (distance >= width) return 0;
    return Math.exp(-Math.pow(distance / width, 2) * 3.2);
  }

  function buildSamples() {
    var holder = document.createElementNS(NS, "svg");
    holder.setAttribute("aria-hidden", "true");
    holder.style.cssText = "position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none";
    document.body.appendChild(holder);

    var measurePaths = mark.paths.map(function (pathData) {
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", pathData);
      holder.appendChild(path);
      return path;
    });

    measurePaths.forEach(function (path) {
      var length = path.getTotalLength();
      var count = Math.max(32, Math.round(length / 4.5));
      var points = [];
      for (var index = 0; index < count; index += 1) {
        var point = path.getPointAtLength((length * index) / count);
        points.push([point.x, point.y]);
      }
      samples.push(points);
    });

    svg.setAttribute("viewBox", mark.viewBox);
    ghostPath.setAttribute("d", mark.paths.join(" "));
  }

  function dentReveal(now) {
    if (dentRevealStart === null) return 1;
    var progress = clamp((now - dentRevealStart) / REVEAL_DURATION, 0, 1);
    return 1 - Math.pow(1 - progress, 3);
  }

  function displacement(t, now) {
    var amount = 0;

    if (mode === "still") {
      var reveal = dentReveal(now);
      for (var index = 0; index < dents.length; index += 1) {
        var dent = dents[index];
        amount += dent.strength * gaussian(circularDistance(t, dent.t), 0.085) * dent.dir * reveal;
      }
      for (var nudgeIndex = 0; nudgeIndex < tempDents.length; nudgeIndex += 1) {
        var temp = tempDents[nudgeIndex];
        var progress = clamp((now - temp.start) / temp.duration, 0, 1);
        amount += temp.strength * Math.sin(Math.PI * progress)
          * gaussian(circularDistance(t, temp.t), 0.11) * temp.dir;
      }
      amount *= 0.055;
    } else if (mode === "ripple" && ripple) {
      var rippleProgress = clamp((now - ripple.start) / RIPPLE_DURATION, 0, 1);
      var front = (ripple.origin + rippleProgress) % 1;
      amount = gaussian(circularDistance(t, front), 0.09) * Math.sin(Math.PI * rippleProgress) * 0.05;
    } else if (mode === "pulse") {
      amount = Math.sin(clock * pulseSpeed + pulsePhase) * pulseAmp * (1 + pulseBoost);
    }

    return amount;
  }

  function render(now) {
    var pathData = samples.map(function (points) {
      var count = points.length;
      var commands = [];
      for (var index = 0; index < points.length; index += 1) {
        var x = points[index][0];
        var y = points[index][1];
        var dx = x - cx;
        var dy = y - cy;
        var length = Math.sqrt(dx * dx + dy * dy) || 1;
        var amount = displacement(index / count, now) * size * ampScale;
        var px = x + (dx / length) * amount;
        var py = y + (dy / length) * amount;
        commands.push((index === 0 ? "M" : "L") + px.toFixed(1) + " " + py.toFixed(1));
      }
      commands.push("Z");
      return commands.join("");
    }).join(" ");
    livePath.setAttribute("d", pathData);
  }

  function needsFrame() {
    if (!playing) return false;
    if (mode === "pulse") return true;
    return dentRevealStart !== null || ripple !== null || tempDents.length > 0 || pulseBoost > 0;
  }

  function tick(now) {
    frameId = null;
    var delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
    lastFrame = now;
    clock += delta;

    if (dentRevealStart !== null && now - dentRevealStart >= REVEAL_DURATION) dentRevealStart = null;
    if (ripple && now - ripple.start >= RIPPLE_DURATION) ripple = null;
    tempDents = tempDents.filter(function (temp) { return now - temp.start < temp.duration; });
    if (pulseBoost > 0) pulseBoost = Math.max(0, pulseBoost - delta / 1.6);

    render(now);
    if (needsFrame()) frameId = window.requestAnimationFrame(tick);
  }

  function schedule() {
    if (playing && frameId === null) frameId = window.requestAnimationFrame(tick);
  }

  function updateLabel() {
    if (!playing) {
      liveLabel.textContent = "Paused";
      liveLabel.dataset.state = "paused";
      return;
    }
    if (dataSource === "live") {
      liveLabel.textContent = "Live activity";
      liveLabel.dataset.state = "live";
    } else if (dataSource === "cached") {
      liveLabel.textContent = "Cached activity";
      liveLabel.dataset.state = "live";
    } else {
      liveLabel.textContent = "Local time signal";
      liveLabel.dataset.state = "fallback";
    }
  }

  function setPlaying(next) {
    playing = next;
    if (!playing) {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      lastFrame = 0;
      dentRevealStart = null;
      ripple = null;
      tempDents = [];
      pulseBoost = 0;
    }
    toggleButton.textContent = playing ? "Pause animation" : "Play animation";
    render(performance.now());
    renderStatus();
    updateLabel();
    if (playing) schedule();
  }

  function relativeTime(timestamp) {
    if (!timestamp) return "…";
    var seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (seconds < 60) return "just now";
    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + " min ago";
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + (hours === 1 ? " hr ago" : " hrs ago");
    var days = Math.floor(hours / 24);
    return days + (days === 1 ? " day ago" : " days ago");
  }

  function setStat(name, value) {
    if (statElements[name]) statElements[name].textContent = value;
  }

  function status(message) {
    statusMessage = message;
    renderStatus();
  }

  function renderStatus() {
    var prefix = motionQuery.matches && !playing ? "Reduced motion is on. Press Play to animate. " : "";
    statusText.textContent = prefix + statusMessage;
  }

  function updatePulse(signal) {
    var ageDays = 30;
    if (signal && signal.latest) {
      ageDays = clamp((Date.now() - Date.parse(signal.latest)) / 86400000, 0, 30);
    }
    var freshness = 1 - ageDays / 30;
    pulseAmp = 0.006 + freshness * 0.01;
    pulseSpeed = 0.4 + freshness * 0.5;
  }

  function triggerActivity(signal) {
    var origin = signal && signal.marks && signal.marks[0] ? signal.marks[0].t : Math.random();
    if (mode === "still") dentRevealStart = performance.now();
    else if (mode === "ripple") ripple = { start: performance.now(), origin: origin };
    else if (mode === "pulse") pulseBoost = 0.9;
  }

  function useSignal(signal, source) {
    dataSource = source;
    dents = (signal.marks || []).slice();
    updatePulse(signal);

    if (source === "fallback") {
      setStat("commits", "…");
      setStat("repos", "…");
      setStat("last", "…");
      setStat("source", "Sydney time");
      status("GitHub is unavailable right now, so this one is following the time of day in Sydney.");
    } else {
      setStat("commits", String(signal.commits));
      setStat("repos", String(signal.repos));
      setStat("last", relativeTime(Date.parse(signal.latest)));
      setStat("source", "Public GitHub events");
      status(source === "live"
        ? "Public activity loaded. Switch motion styles to see how it responds."
        : "Using cached public activity from " + relativeTime(signal.time) + ". Checking again soon.");
    }

    render(performance.now());
    schedule();
    updateLabel();
  }

  function storedMode() {
    try {
      var value = window.localStorage.getItem(MOTION_KEY);
      return MODES.indexOf(value) >= 0 ? value : "still";
    } catch (error) {
      return "still";
    }
  }

  function setMode(next) {
    mode = next;
    motionButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.motion === mode));
    });
    if (modeNote) modeNote.textContent = MODE_NOTES[mode];
    try {
      window.localStorage.setItem(MOTION_KEY, mode);
    } catch (error) {
      // Remembering the choice is a nicety, not a requirement.
    }
    dentRevealStart = null;
    ripple = null;
    tempDents = [];
    pulseBoost = 0;
    lastFrame = 0;
    render(performance.now());
    schedule();
  }

  toggleButton.addEventListener("click", function () { setPlaying(!playing); });

  ghostButton.addEventListener("click", function () {
    var visible = ghostPath.classList.toggle("is-visible");
    ghostButton.setAttribute("aria-pressed", String(visible));
    ghostButton.textContent = visible ? "Stop comparing" : "Compare with original";
    if (legend) legend.hidden = !visible;
  });

  nudgeButton.addEventListener("click", function () {
    if (mode === "ripple") {
      ripple = { start: performance.now(), origin: Math.random() };
    } else if (mode === "pulse") {
      pulseBoost = 1;
    } else {
      tempDents = [{
        t: Math.random(),
        strength: 0.5,
        dir: 1,
        start: performance.now(),
        duration: NUDGE_DURATION
      }];
    }
    if (!playing) setPlaying(true);
    schedule();
  });

  motionButtons.forEach(function (button) {
    button.addEventListener("click", function () { setMode(button.dataset.motion); });
  });

  ampInput.addEventListener("input", function () {
    ampScale = Number(ampInput.value) / 100;
    ampOutput.textContent = ampInput.value + "%";
    render(performance.now());
  });

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (event) {
      if (event.matches) setPlaying(false);
      else renderStatus();
    });
  }

  activity.onUpdate(function (update) {
    if (!update || !update.signal) return;
    useSignal(update.signal, update.source);
  });

  activity.onNewEvent(function (signal) {
    triggerActivity(signal);
    schedule();
  });

  buildSamples();
  setMode(storedMode());
  activity.start();
})();
