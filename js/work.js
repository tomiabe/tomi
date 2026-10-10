(function () {
  "use strict";

  var palettes = {
    susinsight: ["#f9ffe3", "#3a8b72"],
    wecollect: ["#a7c7ff", "#101a52"],
    zeproc: ["#ffd400", "#e8f3ff"],
    translayte: ["#dcae1d", "#d9dede"],
    fairbnb: ["#257f25", "#d6d6d6"],
    eze: ["#ffeee3", "#001a3b"]
  };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function rgb(hex) {
    return [1, 3, 5].map(function (index) {
      return parseInt(hex.slice(index, index + 2), 16);
    });
  }

  document.querySelectorAll("[data-signal-field]").forEach(function (canvas) {
    var visual = canvas.closest(".project-visual");
    var name = Object.keys(palettes).find(function (key) {
      return visual.classList.contains("visual-" + key);
    });
    if (!name) return;

    var context = canvas.getContext("2d");
    if (!context) return;
    var colors = palettes[name].map(rgb);
    var pointer = { x: -1000, y: -1000, active: false };
    var frame = 0;
    var width = 0;
    var height = 0;

    function draw(time) {
      context.clearRect(0, 0, width, height);
      var spacing = Math.max(10, Math.min(16, Math.floor(width / 31)));
      var wave = reducedMotion.matches ? 0 : time * 0.001;

      for (var y = 0; y < height + spacing; y += spacing) {
        for (var x = 0; x < width + spacing; x += spacing) {
          var dx = x - pointer.x;
          var dy = y - pointer.y;
          var distance = Math.sqrt(dx * dx + dy * dy);
          var influence = pointer.active ? Math.max(0, 1 - distance / 220) : 0;
          var noise = Math.sin(x * 0.075 + y * 0.05 + wave) + Math.cos(y * 0.1 - wave * 0.8);
          if (noise <= 0.56 - influence * 0.48) continue;

          var size = 1.3 + influence * 3.6 + Math.max(0, noise - 0.7) * 1.4;
          var alpha = 0.2 + influence * 0.68;
          var color = colors[Math.abs(Math.floor((x + y) / spacing)) % colors.length];
          context.fillStyle = "rgba(" + color.join(",") + "," + alpha + ")";
          context.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }

    function animate(time) {
      draw(time);
      frame = requestAnimationFrame(animate);
    }

    function start() {
      if (reducedMotion.matches) {
        draw(0);
      } else if (!frame) {
        frame = requestAnimationFrame(animate);
      }
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    }

    function resize() {
      var bounds = visual.getBoundingClientRect();
      var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(0);
    }

    visual.addEventListener("pointerenter", start);
    visual.addEventListener("pointermove", function (event) {
      var bounds = visual.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
      if (reducedMotion.matches) draw(0);
    });
    visual.addEventListener("pointerleave", stop);
    visual.addEventListener("focus", start);
    visual.addEventListener("blur", stop);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(visual);
    else window.addEventListener("resize", resize);
    resize();
  });
})();
