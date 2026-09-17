const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = [...document.querySelectorAll('.topbar nav a')];
const sections = navLinks.map((link) => document.querySelector(link.hash));
let lastFrame = 0;
let frameId = 0;
let fieldTime = 0;
let fieldWidth = 0;
let fieldHeight = 0;
let pointer = { x: -1000, y: -1000 };

function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

function getStoredTheme() {
  try {
    const storedTheme = localStorage.getItem('tomi-theme-choice-v4');
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null;
  } catch {
    return null;
  }
}

function getTimedTheme() {
  try {
    const lagosHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));
    return lagosHour >= 7 && lagosHour < 19 ? 'light' : 'dark';
  } catch {
    return 'light';
  }
}

function setTheme(theme, persist = false) {
  root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  const dark = root.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('i').className = dark ? 'ph ph-sun' : 'ph ph-moon';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#0c0f0a' : '#ffffff';
  if (persist) savePreference('tomi-theme-choice-v4', root.dataset.theme);
}

setTheme(getStoredTheme() || root.dataset.theme || getTimedTheme());
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

function resizeField() {
  fieldWidth = window.innerWidth;
  fieldHeight = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  document.querySelector('#field').width = Math.round(fieldWidth * ratio);
  document.querySelector('#field').height = Math.round(fieldHeight * ratio);
  document.querySelector('#field').getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawField(timestamp) {
  const context = document.querySelector('#field').getContext('2d');
  if (timestamp - lastFrame >= 33) {
    fieldTime += Math.min(timestamp - lastFrame, 50) * .00012;
    lastFrame = timestamp;
    context.clearRect(0, 0, fieldWidth, fieldHeight);
    const color = root.dataset.theme === 'dark' ? '65,234,212' : '12,15,10';
    const spacing = 32;
    for (let column = 0; column < fieldWidth; column += spacing) {
      for (let row = 0; row < fieldHeight; row += spacing) {
        const wave = Math.sin(column * .007 + fieldTime) * Math.cos(row * .008 - fieldTime * .6);
        const distance = Math.hypot(column - pointer.x, row - pointer.y);
        const influence = Math.max(0, 1 - distance / 220);
        const intensity = Math.max(0, wave - .1) * .08 + influence * .1;
        if (intensity < .015) continue;
        context.fillStyle = 'rgba(' + color + ',' + intensity + ')';
        const size = 1.5 + influence * 1.5;
        context.fillRect(column, row, size, size);
      }
    }
  }
  frameId = requestAnimationFrame(drawField);
}

function syncMotion() {
  cancelAnimationFrame(frameId);
  const field = document.querySelector('#field');
  const context = field.getContext('2d');
  if (reducedMotion.matches) {
    context.clearRect(0, 0, fieldWidth, fieldHeight);
    return;
  }
  if (!document.hidden) {
    lastFrame = performance.now();
    frameId = requestAnimationFrame(drawField);
  }
}

window.addEventListener('pointermove', (event) => {
  pointer = { x: event.clientX, y: event.clientY };
}, { passive: true });
document.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; });
window.addEventListener('resize', resizeField);
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncMotion(); });
reducedMotion.addEventListener('change', syncMotion);
resizeField();
syncMotion();

let scrollQueued = false;
function updateSection() {
  const readingLine = 140;
  let current = sections[0];
  for (const section of sections) {
    if (section && section.getBoundingClientRect().top <= readingLine) current = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
    current = sections[sections.length - 1];
  }
  navLinks.forEach((link) => {
    if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateSection);
  }
}, { passive: true });
updateSection();

// Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelector('#year').textContent = new Date().getFullYear();

// Work card shader fields — ported from studio.tomiabe.com (drawSignalField)
// Cards are self-contained <a> links, so pointer tracking binds to the card,
// not the canvas container.
const workShaderPalettes = {
  susinsight: ['#f9ffe3', '#3a8b72'],
  culerson: ['#f2c94c', '#2b2c28'],
  wecollect: ['#a7c7ff', '#101a52'],
  zeproc: ['#ffd400', '#e8f3ff'],
  translayte: ['#dcae1d', '#d9dede'],
  fairbnb: ['#257f25', '#d6d6d6'],
  eze: ['#ffeee3', '#001a3b']
};

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function drawSignalField(canvas, colors = ['#41ead4']) {
  const context = canvas.getContext('2d');
  const container = canvas.closest('.engagement') || canvas.parentElement;
  const shaderColors = colors.map(hexToRgb);
  const pointer = { x: -1000, y: -1000, active: false };
  let frame = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function resize() {
    const bounds = container.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(bounds.width));
    height = Math.max(1, Math.floor(bounds.height));
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw(0);
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const spacing = Math.max(10, Math.min(16, Math.floor(width / 31)));
    const wave = reducedMotion.matches ? 0 : time * 0.001;
    for (let y = 0; y < height + spacing; y += spacing) {
      for (let x = 0; x < width + spacing; x += spacing) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = pointer.active ? Math.max(0, 1 - distance / 220) : 0;
        const noise = Math.sin(x * 0.075 + y * 0.05 + wave) + Math.cos(y * 0.1 - wave * 0.8);
        const active = noise > 0.56 - influence * 0.48;
        if (!active) continue;
        const size = 1.3 + influence * 3.6 + Math.max(0, noise - 0.7) * 1.4;
        const alpha = 0.2 + influence * 0.68;
        const color = shaderColors[Math.abs(Math.floor((x + y) / spacing)) % shaderColors.length];
        context.fillStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + alpha + ')';
        context.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
    if (!reducedMotion.matches) {
      frame = requestAnimationFrame(draw);
    }
  }

  container.addEventListener('pointermove', (event) => {
    const bounds = container.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  });
  container.addEventListener('pointerleave', () => {
    pointer.active = false;
    pointer.x = -1000;
    pointer.y = -1000;
  });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
  else window.addEventListener('resize', resize);
  resize();

  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}

document.querySelectorAll('[data-work-shader-canvas]').forEach((canvas) => {
  const palette = canvas.dataset.shaderPalette;
  if (palette) {
    drawSignalField(canvas, workShaderPalettes[palette] || ['#41ead4']);
    return;
  }
  const card = canvas.closest('[class*="work-card--"]');
  const id = card ? card.className.match(/work-card--([a-z-]+)/)[1] : '';
  drawSignalField(canvas, workShaderPalettes[id] || ['#41ead4']);
});
