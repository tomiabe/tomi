(function () {
  "use strict";

  var root = document.documentElement;
  var themeKey = "tomi-home-theme";
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var rail = document.querySelector("[data-rail]");
  var menu = document.querySelector("[data-menu-toggle]");

  function storedTheme() {
    try {
      var value = localStorage.getItem(themeKey);
      return value === "light" || value === "dark" ? value : "system";
    } catch (error) {
      return "system";
    }
  }

  function syncTheme() {
    var choice = storedTheme();
    root.dataset.theme = choice === "system" ? (media.matches ? "dark" : "light") : choice;
    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === choice));
    });
  }

  document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
    button.addEventListener("click", function () {
      try {
        if (button.dataset.themeChoice === "system") localStorage.removeItem(themeKey);
        else localStorage.setItem(themeKey, button.dataset.themeChoice);
      } catch (error) {
        // The page still works when local storage is unavailable.
      }
      syncTheme();
    });
  });
  media.addEventListener("change", syncTheme);
  syncTheme();

  function updateClock() {
    var time = document.querySelector("[data-live-time]");
    if (!time) return;
    time.textContent = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date());
    time.dateTime = new Date().toISOString();
  }
  updateClock();
  setInterval(updateClock, 30000);

  document.querySelectorAll("[data-room-link]").forEach(function (link) {
    if (link.pathname === location.pathname || (link.pathname === "/journal/" && location.pathname.startsWith("/journal/"))) {
      link.setAttribute("aria-current", "page");
    }
  });

  if (rail && menu) {
    function closeMenu() {
      rail.classList.remove("is-open");
      menu.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    menu.addEventListener("click", function () {
      var open = !rail.classList.contains("is-open");
      rail.classList.toggle("is-open", open);
      menu.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    rail.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
    window.matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);
  }
})();
