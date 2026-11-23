(function () {
  "use strict";

  var mark = window.TOMI_MARK;
  var activity = window.TOMI_LOGO_ACTIVITY;
  if (!mark || !activity || !mark.paths || mark.paths.length !== 2) return;

  var NS = "http://www.w3.org/2000/svg";
  var viewBox = mark.viewBox.split(/\s+/).map(Number);
  var cx = viewBox[0] + viewBox[2] / 2;
  var cy = viewBox[1] + viewBox[3] / 2;
  var size = Math.max(viewBox[2], viewBox[3]);
  var RIPPLE_DURATION = 2200;
  var NAV_AMPLITUDE = 0.075;
  var FIGURE_AMPLITUDE = 0.045;
  var baseData = mark.paths.join(" ");
  var samples = null;

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

  function getSamples() {
    if (samples) return samples;

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

    samples = measurePaths.map(function (path) {
      var length = path.getTotalLength();
      var count = Math.max(32, Math.round(length / 4.5));
      var points = [];
      for (var index = 0; index < count; index += 1) {
        var point = path.getPointAtLength((length * index) / count);
        points.push([point.x, point.y]);
      }
      return points;
    });

    document.body.removeChild(holder);
    return samples;
  }

  function ripplePath(progress, origin, amplitude) {
    if (!progress || progress <= 0 || progress >= 1) return baseData;
    var front = (origin + progress) % 1;
    var factor = Math.sin(Math.PI * progress) * amplitude * size;

    return getSamples().map(function (points) {
      var count = points.length;
      var commands = [];
      for (var index = 0; index < points.length; index += 1) {
        var x = points[index][0];
        var y = points[index][1];
        var dx = x - cx;
        var dy = y - cy;
        var length = Math.sqrt(dx * dx + dy * dy) || 1;
        var amount = gaussian(circularDistance(index / count, front), 0.09) * factor;
        commands.push((index === 0 ? "M" : "L") + (x + dx / length * amount).toFixed(1) + " " + (y + dy / length * amount).toFixed(1));
      }
      commands.push("Z");
      return commands.join("");
    }).join(" ");
  }

  window.TOMI_LOGO_SHAPE = {
    viewBox: mark.viewBox,
    base: function () { return baseData; },
    ripple: ripplePath
  };

  var anchors = Array.prototype.slice.call(document.querySelectorAll(".brand-mark, .mobile-mark"));
  var paths = [];

  anchors.forEach(function (anchor) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", mark.viewBox);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var path = document.createElementNS(NS, "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("d", baseData);
    svg.appendChild(path);

    Array.prototype.slice.call(anchor.querySelectorAll("img")).forEach(function (image) {
      anchor.removeChild(image);
    });
    anchor.appendChild(svg);
    paths.push(path);
  });

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ripple = null;
  var frameId = null;

  function setPaths(data) {
    paths.forEach(function (path) { path.setAttribute("d", data); });
  }

  function tick(now) {
    frameId = null;
    if (!ripple) return;
    var progress = (now - ripple.start) / RIPPLE_DURATION;
    if (progress >= 1) {
      ripple = null;
      setPaths(baseData);
      return;
    }
    setPaths(ripplePath(progress, ripple.origin, NAV_AMPLITUDE));
    frameId = window.requestAnimationFrame(tick);
  }

  function trigger(signal) {
    if (motionQuery.matches || !paths.length) return;
    var origin = signal && signal.marks && signal.marks[0] ? signal.marks[0].t : Math.random();
    ripple = { start: performance.now(), origin: origin };
    if (frameId === null) frameId = window.requestAnimationFrame(tick);
  }

  if (paths.length) activity.onNewEvent(trigger);

  var baseFigurePath = document.querySelector("[data-logo-base] path");
  var rippleFigurePath = document.querySelector("[data-logo-ripple] path");
  if (baseFigurePath) baseFigurePath.setAttribute("d", baseData);

  if (rippleFigurePath) {
    var FIGURE_DURATION = 2600;
    var FIGURE_PAUSE = 400;
    var figureStart = null;
    var figureFrame = null;

    function animateFigure(now) {
      figureFrame = null;
      if (document.visibilityState !== "visible") {
        figureStart = null;
        rippleFigurePath.setAttribute("d", baseData);
        return;
      }
      if (figureStart === null) figureStart = now;
      var elapsed = now - figureStart;
      var phase = elapsed % (FIGURE_DURATION + FIGURE_PAUSE);
      if (phase > FIGURE_DURATION) rippleFigurePath.setAttribute("d", baseData);
      else rippleFigurePath.setAttribute("d", ripplePath(phase / FIGURE_DURATION, 0.2, FIGURE_AMPLITUDE));
      figureFrame = window.requestAnimationFrame(animateFigure);
    }

    if (!motionQuery.matches) {
      figureFrame = window.requestAnimationFrame(animateFigure);
      if (motionQuery.addEventListener) {
        motionQuery.addEventListener("change", function (event) {
          if (event.matches) {
            if (figureFrame !== null) window.cancelAnimationFrame(figureFrame);
            figureFrame = null;
            rippleFigurePath.setAttribute("d", baseData);
          } else if (figureFrame === null) {
            figureStart = null;
            figureFrame = window.requestAnimationFrame(animateFigure);
          }
        });
      }
    } else {
      rippleFigurePath.setAttribute("d", ripplePath(0.5, 0.2, FIGURE_AMPLITUDE));
    }
  }

  activity.start();
})();
