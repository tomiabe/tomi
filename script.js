const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeToggle = document.querySelector('.theme-toggle');
const rail = document.querySelector('.rail');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = [...document.querySelectorAll('#site-nav a')];
const chapters = navLinks.map((link) => document.querySelector(link.hash));
let smoothScroll;

document.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach((link) => {
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

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
    const lagosHour = Number(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos', hour: 'numeric', hourCycle: 'h23'
    }).format(new Date()));
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

function syncAutomaticTheme() {
  if (!getStoredTheme()) setTheme(getTimedTheme());
}

setTheme(getStoredTheme() || root.dataset.theme || getTimedTheme());
setInterval(syncAutomaticTheme, 60000);
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

function setupSmoothScroll() {
  const LenisConstructor = globalThis.Lenis || window.Lenis;
  if (reducedMotion.matches || !LenisConstructor) return null;
  const lenis = new LenisConstructor({
    autoRaf: true,
    duration: 1.05,
    easing: (progress) => Math.min(1, 1.001 - Math.pow(2, -10 * progress)),
    smoothWheel: true,
    syncTouch: false
  });
  const syncScrollState = () => {
    if (document.body.classList.contains('menu-open') || document.body.classList.contains('dialog-open')) lenis.stop();
    else lenis.start();
  };
  new MutationObserver(syncScrollState).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  return lenis;
}

smoothScroll = setupSmoothScroll();

function setMenu(open) {
  rail.classList.toggle('menu-open', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuToggle.querySelector('i').className = open ? 'ph ph-x' : 'ph ph-list';
}

menuToggle.addEventListener('click', () => setMenu(!rail.classList.contains('menu-open')));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && rail.classList.contains('menu-open')) {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!rail.contains(event.target)) setMenu(false);
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = document.getElementById(link.hash.slice(1));
    if (!destination) return;
    event.preventDefault();
    setMenu(false);
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
    if (smoothScroll && !reducedMotion.matches) {
      smoothScroll.scrollTo(destination, { offset: window.innerWidth <= 980 ? -84 : -28 });
    } else {
      destination.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    }
    try { history.pushState(null, '', link.hash); } catch { location.hash = link.hash; }
  });
});
let scrollQueued = false;
function updateSection() {
  const readingLine = window.innerWidth <= 980 ? 150 : 120;
  let current = chapters[0];
  for (const chapter of chapters) {
    if (chapter.getBoundingClientRect().top <= readingLine) current = chapter;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) current = chapters[chapters.length - 1];
  navLinks.forEach((link) => {
    if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
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
window.addEventListener('resize', () => {
  if (window.innerWidth > 980) setMenu(false);
  updateSection();
});
updateSection();
document.querySelector('#year').textContent = new Date().getFullYear();
function updateClock() {
  const clock = document.querySelector('#lagos-time');
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Lagos', hour: 'numeric', minute: '2-digit', hour12: true
  }).format(now);
  clock.dateTime = now.toISOString();
}
updateClock();
setInterval(updateClock, 60000);

const photos = [
  { file: 'field.jpeg', title: 'Reflections', alt: 'A mirrored sphere reflecting people and buildings beneath a blue sky.' },
  { file: 'place.jpeg', title: 'In transit', alt: 'An aeroplane wing and clouds seen through a purple-tinted window.' },
  { file: 'light.jpg', title: 'On the road', alt: 'Cars travelling along a winding road beneath sunlit trees.' },
  { file: 'texture.jpg', title: 'Sheffield', alt: 'The Tony Currie Stand at Sheffield United, with its repeating concrete pillars.' },
  { file: 'corner.jpeg', title: 'A place to make', alt: 'Colourful chairs beside a wall that reads Make your ideas come to life.' },
  { file: 'chance.jpeg', title: 'An open gate', alt: 'A garden entrance framed by palms and Ghanaian flags.' },
  { file: 'fragment.jpeg', title: 'Made by hand', alt: 'A shop display of carved masks, figures and brightly patterned baskets.' },
  { file: 'detail.jpeg', title: 'Lines and light', alt: 'Rows of parked cars and painted lines beneath an expansive blue sky.' },
  { file: 'portrait.jpeg', title: 'Looking up', alt: 'An art installation of sculpted hands suspended from gallery ceiling beams.' }
];
const story = document.querySelector('.story');
const storyImage = document.querySelector('#story-image');
const storyStatus = document.querySelector('.story-status');
const storyProgress = document.querySelector('.story-progress');
const playButton = document.querySelector('[data-story="pause"]');
const dialog = document.querySelector('#photo-dialog');
const fullPhoto = document.querySelector('#full-photo');
const openPhotoButton = document.querySelector('.story-image-button');
let photoIndex = 0;
let paused = reducedMotion.matches;
let inView = false;
let hovered = false;
let playbackRequested = false;
let storyTimer;
let photoRequest = 0;
photos.forEach(() => storyProgress.append(document.createElement('span')));

function syncPhoto() {
  const photo = photos[photoIndex];
  const count = String(photoIndex + 1).padStart(2, '0') + ' / ' + String(photos.length).padStart(2, '0');
  storyImage.src = 'assets/images/media/' + photo.file;
  storyImage.alt = photo.alt;
  document.querySelector('#story-caption').textContent = photo.title;
  document.querySelector('#story-count').textContent = count;
  openPhotoButton.setAttribute('aria-label', 'Enlarge photograph: ' + photo.title);
  [...storyProgress.children].forEach((segment, index) => segment.classList.toggle('is-current', index === photoIndex));
  if (dialog.open) {
    fullPhoto.src = storyImage.src;
    fullPhoto.alt = photo.alt;
    document.querySelector('#dialog-count').textContent = count;
    document.querySelector('#dialog-caption').textContent = photo.title;
  }
}
function queueStory() {
  clearTimeout(storyTimer);
  if (paused || !inView || dialog.open || document.hidden) return;
  if (!playbackRequested && (hovered || story.contains(document.activeElement))) return;
  storyTimer = setTimeout(() => changePhoto(1), 4000);
}
function changePhoto(direction, announce = false) {
  clearTimeout(storyTimer);
  if (announce) playbackRequested = false;
  document.querySelectorAll('.photo-loading').forEach((label) => { label.hidden = false; });
  openPhotoButton.setAttribute('aria-busy', 'true');
  const nextIndex = (photoIndex + direction + photos.length) % photos.length;
  const request = ++photoRequest;
  const pendingImage = new Image();
  pendingImage.onload = () => {
    if (request !== photoRequest) return;
    photoIndex = nextIndex;
    document.querySelectorAll('.photo-loading').forEach((label) => { label.hidden = true; });
    openPhotoButton.setAttribute('aria-busy', 'false');
    syncPhoto();
    storyStatus.classList.add('sr-only');
    if (announce) storyStatus.textContent = photos[photoIndex].title + ', photograph ' + (photoIndex + 1) + ' of ' + photos.length;
    queueStory();
  };
  pendingImage.onerror = () => {
    if (request !== photoRequest) return;
    document.querySelectorAll('.photo-loading').forEach((label) => { label.hidden = true; });
    openPhotoButton.setAttribute('aria-busy', 'false');
    setPaused(true);
    storyStatus.classList.remove('sr-only');
    storyStatus.textContent = 'This photograph could not load. Please try again.';
    if (dialog.open) document.querySelector('#dialog-caption').textContent = storyStatus.textContent;
  };
  pendingImage.src = 'assets/images/media/' + photos[nextIndex].file;
}
function setPaused(value) {
  paused = value;
  playButton.setAttribute('aria-pressed', String(paused));
  playButton.setAttribute('aria-label', paused ? 'Play photo relay' : 'Pause photo relay');
  playButton.querySelector('i').className = paused ? 'ph ph-play' : 'ph ph-pause';
  playButton.querySelector('span').textContent = paused ? 'Play' : 'Pause';
  queueStory();
}
playButton.addEventListener('click', () => {
  playbackRequested = paused;
  setPaused(!paused);
});
document.querySelector('[data-story="previous"]').addEventListener('click', () => changePhoto(-1, true));
document.querySelector('[data-story="next"]').addEventListener('click', () => changePhoto(1, true));
story.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') { hovered = true; queueStory(); }
});
story.addEventListener('pointerleave', () => { hovered = false; queueStory(); });
story.addEventListener('focusin', (event) => {
  if (event.target !== playButton) playbackRequested = false;
  queueStory();
});
story.addEventListener('focusout', () => setTimeout(queueStory, 0));
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  queueStory();
}, { threshold: .3 }).observe(story);
openPhotoButton.addEventListener('click', () => {
  document.body.classList.add('dialog-open');
  dialog.showModal();
  syncPhoto();
  queueStory();
});
document.querySelector('[data-dialog="close"]').addEventListener('click', () => dialog.close());
document.querySelector('[data-dialog="previous"]').addEventListener('click', () => changePhoto(-1));
document.querySelector('[data-dialog="next"]').addEventListener('click', () => changePhoto(1));
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  openPhotoButton.focus({ preventScroll: true });
  queueStory();
});
syncPhoto();
setPaused(paused);

const canvas = document.querySelector('#field');
const context = canvas.getContext('2d');
let fieldWidth = 0;
let fieldHeight = 0;
let frameId = 0;
let lastFrame = 0;
let fieldTime = 0;
let pointer = { x: -1000, y: -1000 };

function resizeField() {
  if (!context) return;
  fieldWidth = window.innerWidth;
  fieldHeight = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(fieldWidth * ratio);
  canvas.height = Math.round(fieldHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function drawField(timestamp) {
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
  const disabled = !context || reducedMotion.matches;
  if (disabled && context) context.clearRect(0, 0, fieldWidth, fieldHeight);
  if (!disabled && !document.hidden) {
    lastFrame = performance.now();
    frameId = requestAnimationFrame(drawField);
  }
}
window.addEventListener('pointermove', (event) => {
  pointer = { x: event.clientX, y: event.clientY };
}, { passive: true });
document.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; });
window.addEventListener('resize', resizeField);
document.addEventListener('visibilitychange', () => { queueStory(); syncMotion(); });
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) setPaused(true);
  if (smoothScroll) {
    if (reducedMotion.matches) smoothScroll.stop();
    else smoothScroll.start();
  } else if (!reducedMotion.matches) {
    smoothScroll = setupSmoothScroll();
  }
  syncMotion();
});
resizeField();
syncMotion();
