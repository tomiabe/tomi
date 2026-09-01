const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('#site-nav a');
const savedTheme = localStorage.getItem('tomi-theme');
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('tomi-theme', theme);
  themeToggle.querySelector('i').className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

setTheme(savedTheme || (preferredDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const canvas = document.querySelector('#field');
const context = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let width = 0;
let height = 0;
let pointer = { x: -1000, y: -1000 };
let points = [];

function getColor() {
  return getComputedStyle(root).getPropertyValue('--canvas-particle').trim();
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const total = Math.max(18, Math.min(44, Math.floor((width * height) / 43000)));
  points = Array.from({ length: total }, (_, index) => ({
    x: (index * 109) % width,
    y: (index * 167) % height,
    speed: .08 + (index % 5) * .025,
    size: 1 + (index % 3) * .35
  }));
}

function draw() {
  if (reducedMotion.matches) return;
  context.clearRect(0, 0, width, height);
  const color = getColor();
  points.forEach((point, index) => {
    point.y -= point.speed;
    if (point.y < -10) point.y = height + 10;
    const distance = Math.hypot(pointer.x - point.x, pointer.y - point.y);
    const pull = Math.max(0, 1 - distance / 180);
    const x = point.x + (pointer.x - point.x) * pull * .045;
    const y = point.y + (pointer.y - point.y) * pull * .045;
    context.beginPath();
    context.fillStyle = `rgba(${color}, ${.11 + pull * .2})`;
    context.arc(x, y, point.size, 0, Math.PI * 2);
    context.fill();
    if (index % 4 === 0 && pull > .04) {
      context.strokeStyle = `rgba(${color}, ${pull * .12})`;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(pointer.x, pointer.y);
      context.stroke();
    }
  });
  requestAnimationFrame(draw);
}

window.addEventListener('pointermove', (event) => {
  pointer = { x: event.clientX, y: event.clientY };
});
window.addEventListener('resize', resize);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) context.clearRect(0, 0, width, height);
  else draw();
});
resize();
draw();

const visualStoryImage = document.querySelector('.visual-story-image');
const visualStoryLoader = document.querySelector('.visual-story-loader');
const visualStoryTitle = document.querySelector('.visual-story-title');
const visualStoryCount = document.querySelector('.visual-story-count');
const visualStoryProgress = document.querySelector('.visual-story-progress');
const visualStoryToggle = document.querySelector('.visual-story-toggle');
const visualStoryFrame = document.querySelector('.visual-story-frame');
const visualPhotos = [
  { src: 'assets/images/media/field.jpeg', title: 'A field note' },
  { src: 'assets/images/media/place.jpeg', title: 'Passing through' },
  { src: 'assets/images/media/light.jpg', title: 'A study in light' },
  { src: 'assets/images/media/texture.jpg', title: 'Texture' },
  { src: 'assets/images/media/corner.jpeg', title: 'A quiet corner' },
  { src: 'assets/images/media/chance.jpeg', title: 'Colour and chance' },
  { src: 'assets/images/media/fragment.jpeg', title: 'A fragment' },
  { src: 'assets/images/media/detail.jpeg', title: 'A closer look' },
  { src: 'assets/images/media/portrait.jpeg', title: 'Someone, somewhere' }
];
let visualStoryIndex = 0;
let visualStoryPaused = reducedMotion.matches;
let visualStoryTimer;

visualStoryProgress.innerHTML = visualPhotos.map(() => '<span></span>').join('');

function paintVisualStory() {
  const photo = visualPhotos[visualStoryIndex];
  visualStoryImage.classList.add('is-changing');
  visualStoryLoader.classList.remove('is-hidden');
  window.setTimeout(() => {
    visualStoryImage.src = photo.src;
    visualStoryImage.alt = `A photograph from Tomi Abe's visual archive: ${photo.title}`;
    visualStoryImage.classList.remove('is-changing');
  }, 180);
  visualStoryTitle.textContent = photo.title;
  visualStoryCount.textContent = `${String(visualStoryIndex + 1).padStart(2, '0')} / ${String(visualPhotos.length).padStart(2, '0')}`;
  [...visualStoryProgress.children].forEach((segment, index) => {
    segment.className = index < visualStoryIndex ? 'is-done' : index === visualStoryIndex && !visualStoryPaused ? 'is-active' : '';
  });
}

function queueVisualStory() {
  window.clearTimeout(visualStoryTimer);
  if (!visualStoryPaused) {
    visualStoryTimer = window.setTimeout(() => {
      visualStoryIndex = (visualStoryIndex + 1) % visualPhotos.length;
      paintVisualStory();
      queueVisualStory();
    }, 2800);
  }
}

function setVisualStoryPause(paused) {
  visualStoryPaused = paused;
  visualStoryToggle.textContent = paused ? 'Play' : 'Pause';
  visualStoryToggle.setAttribute('aria-pressed', String(paused));
  visualStoryToggle.setAttribute('aria-label', paused ? 'Play story relay' : 'Pause story relay');
  paintVisualStory();
  queueVisualStory();
}

visualStoryToggle.addEventListener('click', () => setVisualStoryPause(!visualStoryPaused));
visualStoryImage.addEventListener('load', () => visualStoryLoader.classList.add('is-hidden'));
visualStoryImage.addEventListener('error', () => visualStoryLoader.classList.add('is-hidden'));
if (visualStoryImage.complete) visualStoryLoader.classList.add('is-hidden');
visualStoryFrame.addEventListener('mouseenter', () => !visualStoryPaused && window.clearTimeout(visualStoryTimer));
visualStoryFrame.addEventListener('mouseleave', () => !visualStoryPaused && queueVisualStory());
document.querySelector('.visual-story-next').addEventListener('click', () => {
  visualStoryIndex = (visualStoryIndex + 1) % visualPhotos.length;
  paintVisualStory();
  queueVisualStory();
});
document.querySelector('.visual-story-previous').addEventListener('click', () => {
  visualStoryIndex = (visualStoryIndex - 1 + visualPhotos.length) % visualPhotos.length;
  paintVisualStory();
  queueVisualStory();
});

paintVisualStory();
queueVisualStory();
