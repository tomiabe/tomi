(function () {
  "use strict";

  var CACHE_KEY = "tomi-logo-activity-v3";
  var CACHE_TTL = 15 * 60 * 1000;
  var POLL_INTERVAL = 2 * 60 * 1000;

  var updateListeners = [];
  var eventListeners = [];
  var state = {
    signal: null,
    source: "loading",
    lastUpdated: 0,
    lastFetchAttempt: 0,
    fetching: false,
    started: false
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hashString(value) {
    var hash = 0;
    for (var index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
  }

  function summarize(events, now) {
    var weekStart = now - 7 * 24 * 60 * 60 * 1000;
    var pushes = events.filter(function (event) {
      return event.type === "PushEvent" && Date.parse(event.created_at) >= weekStart;
    });
    var commits = pushes.reduce(function (total, event) {
      return total + ((event.payload && event.payload.commits && event.payload.commits.length) || 0);
    }, 0);
    var repos = pushes.map(function (event) {
      return event.repo && event.repo.name;
    }).filter(Boolean);

    var marks = events.slice(0, 8).map(function (event) {
      var repo = (event.repo && event.repo.name) || "";
      var hash = hashString(repo + event.type + (event.id || ""));
      var ageDays = clamp((now - Date.parse(event.created_at)) / 86400000, 0, 60);
      var push = event.type === "PushEvent";
      var count = push ? ((event.payload && event.payload.commits && event.payload.commits.length) || 0) : 0;
      var base = push ? 0.18 + Math.min(count, 12) / 12 * 0.5 : 0.16;
      return {
        t: (hash % 1000) / 1000,
        strength: clamp(base * Math.exp(-ageDays / 21), 0.03, 0.7),
        dir: push ? 1 : -1
      };
    });

    return {
      time: now,
      id: events[0] && events[0].id,
      latest: events[0] && events[0].created_at,
      events: events.length,
      commits: commits,
      repos: new Set(repos).size,
      marks: marks
    };
  }

  function snapshot() {
    return {
      signal: state.signal,
      source: state.source,
      lastUpdated: state.lastUpdated
    };
  }

  function emitUpdate() {
    updateListeners.forEach(function (listener) { listener(snapshot()); });
  }

  function emitNewEvent(signal) {
    eventListeners.forEach(function (listener) { listener(signal); });
  }

  function apply(signal, source, changed) {
    state.signal = signal;
    state.source = source;
    state.lastUpdated = signal && signal.time ? signal.time : Date.now();
    emitUpdate();
    if (changed) emitNewEvent(signal);
  }

  function readCache() {
    try {
      var raw = window.localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeCache(signal) {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(signal));
    } catch (error) {
      // Storage is optional; the mark still works without it.
    }
  }

  function load(force) {
    var cached = readCache();
    var cacheAge = cached && cached.time ? Date.now() - cached.time : Infinity;
    if (!force && cached && cacheAge < CACHE_TTL && cacheAge > -60 * 1000) {
      state.lastFetchAttempt = Date.now();
      apply(cached, "cached", false);
      return;
    }
    if (state.fetching || Date.now() - state.lastFetchAttempt < POLL_INTERVAL) return;
    state.lastFetchAttempt = Date.now();
    state.fetching = true;

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = null;
    if (controller) timer = window.setTimeout(function () { controller.abort(); }, 8000);

    window.fetch("https://api.github.com/users/tomiabe/events/public?per_page=100", {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (timer) window.clearTimeout(timer);
      if (!response.ok) throw new Error("GitHub returned " + response.status);
      return response.json();
    }).then(function (events) {
      state.fetching = false;
      if (!Array.isArray(events) || !events.length) throw new Error("No public events");
      var signal = summarize(events, Date.now());
      var changed = Boolean(cached && cached.id && signal.id && cached.id !== signal.id);
      writeCache(signal);
      apply(signal, "live", changed);
    }).catch(function () {
      state.fetching = false;
      if (timer) window.clearTimeout(timer);
      if (cached) apply(cached, "cached", false);
      else apply({ time: Date.now() }, "fallback", false);
    });
  }

  function start() {
    if (state.started) return;
    state.started = true;
    window.setTimeout(function () { load(false); }, 0);
    window.setInterval(function () {
      emitUpdate();
      if (document.visibilityState === "visible") load(true);
    }, POLL_INTERVAL);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") load(true);
    });
  }

  window.TOMI_LOGO_ACTIVITY = {
    start: start,
    refresh: function () { state.lastFetchAttempt = 0; load(true); },
    get: snapshot,
    onUpdate: function (listener) { updateListeners.push(listener); },
    onNewEvent: function (listener) { eventListeners.push(listener); }
  };
})();
