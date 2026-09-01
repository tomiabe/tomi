const photos = [
  { src: 'assets/images/media/field.jpeg', name: 'A field note' },
  { src: 'assets/images/media/place.jpeg', name: 'Passing through' },
  { src: 'assets/images/media/light.jpg', name: 'A study in light' },
  { src: 'assets/images/media/texture.jpg', name: 'Texture' },
  { src: 'assets/images/media/corner.jpeg', name: 'A quiet corner' },
  { src: 'assets/images/media/chance.jpeg', name: 'Colour and chance' },
  { src: 'assets/images/media/portrait.jpeg', name: 'Someone, somewhere' }
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const story = document.querySelector('[data-story]');
const storyImage = story.querySelector('.story-image');
const storyLoader = story.querySelector('.story-loader');
const storyName = story.querySelector('.story-name');
const storyCount = story.querySelector('.story-count');
const storyProgress = story.querySelector('.story-progress');
const storyToggle = story.querySelector('.story-toggle');
let storyIndex = 0;
let storyPaused = reducedMotion;
let storyTimer;

storyProgress.innerHTML = photos.map(() => '<span></span>').join('');

function paintStory() {
  const photo = photos[storyIndex];
  storyImage.classList.add('is-changing');
  storyLoader.classList.remove('is-hidden');
  window.setTimeout(() => {
    storyImage.src = photo.src;
    storyImage.alt = `A photograph from Tomi Abe's visual archive: ${photo.name}`;
    storyImage.classList.remove('is-changing');
  }, 220);
  storyName.textContent = photo.name;
  storyCount.textContent = `${String(storyIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  [...storyProgress.children].forEach((segment, index) => {
    segment.className = index < storyIndex ? 'is-done' : index === storyIndex && !storyPaused ? 'is-active' : '';
  });
}

function queueStory() {
  window.clearTimeout(storyTimer);
  if (!storyPaused) {
    storyTimer = window.setTimeout(() => {
      storyIndex = (storyIndex + 1) % photos.length;
      paintStory();
      queueStory();
    }, 2800);
  }
}

function setStoryPause(paused) {
  storyPaused = paused;
  storyToggle.textContent = paused ? 'Play' : 'Pause';
  storyToggle.setAttribute('aria-pressed', String(paused));
  storyToggle.setAttribute('aria-label', paused ? 'Play story relay' : 'Pause story relay');
  paintStory();
  queueStory();
}

story.querySelector('.story-next').addEventListener('click', () => {
  storyIndex = (storyIndex + 1) % photos.length;
  paintStory();
  queueStory();
});
story.querySelector('.story-previous').addEventListener('click', () => {
  storyIndex = (storyIndex - 1 + photos.length) % photos.length;
  paintStory();
  queueStory();
});
storyToggle.addEventListener('click', () => setStoryPause(!storyPaused));
storyImage.addEventListener('load', () => storyLoader.classList.add('is-hidden'));
if (storyImage.complete) storyLoader.classList.add('is-hidden');
story.addEventListener('mouseenter', () => !storyPaused && window.clearTimeout(storyTimer));
story.addEventListener('mouseleave', () => !storyPaused && queueStory());
paintStory();
queueStory();

const mosaic = document.querySelector('[data-mosaic]');
const pieces = [...mosaic.querySelectorAll('.mosaic-piece')];
const mosaicPositions = [
  { left: '0%', top: '0%', width: '36%', height: '54%' },
  { left: '37%', top: '0%', width: '25%', height: '36%' },
  { left: '63%', top: '0%', width: '37%', height: '45%' },
  { left: '37%', top: '37%', width: '25%', height: '63%' },
  { left: '0%', top: '55%', width: '36%', height: '45%' },
  { left: '63%', top: '46%', width: '37%', height: '54%' }
];
let mosaicOrder = pieces.map((_, index) => index);
let heldPiece = null;

function paintMosaic() {
  pieces.forEach((piece, index) => {
    const position = mosaicPositions[mosaicOrder[index]];
    Object.assign(piece.style, position);
  });
}

function shuffleMosaic() {
  if (heldPiece || reducedMotion) return;
  mosaicOrder = mosaicOrder.slice(1).concat(mosaicOrder[0]);
  paintMosaic();
}

pieces.forEach((piece) => piece.addEventListener('click', () => {
  if (heldPiece === piece) {
    heldPiece = null;
    piece.classList.remove('is-held');
  } else {
    heldPiece?.classList.remove('is-held');
    heldPiece = piece;
    piece.classList.add('is-held');
  }
}));
paintMosaic();
window.setInterval(shuffleMosaic, 3200);

const deck = document.querySelector('[data-deck]');
const deckCards = [...deck.querySelectorAll('.deck-card')];
const deckTurns = [-24, -15, -5, 5, 15, 24];

deckCards.forEach((card, index) => {
  card.style.setProperty('--turn', `${deckTurns[index]}deg`);
  card.style.setProperty('--offset', `${(index - 2.5) * 18}%`);
  card.style.zIndex = String(index + 1);
  card.addEventListener('click', () => {
    const wasOpen = card.classList.contains('is-open');
    deckCards.forEach((item, itemIndex) => {
      item.classList.remove('is-open');
      item.style.zIndex = String(itemIndex + 1);
    });
    if (!wasOpen) {
      card.classList.add('is-open');
      card.style.zIndex = '20';
    }
  });
});

const strip = document.querySelector('[data-strip]');
strip.querySelectorAll('.strip-frame').forEach((frame) => frame.addEventListener('click', () => {
  strip.querySelectorAll('.strip-frame').forEach((item) => item.classList.remove('is-active'));
  frame.classList.add('is-active');
}));

const keepsakes = document.querySelector('[data-keepsakes]');
keepsakes.querySelectorAll('.keepsake').forEach((keepsake) => keepsake.addEventListener('click', () => {
  const selected = keepsake.classList.contains('is-selected');
  keepsakes.querySelectorAll('.keepsake').forEach((item) => item.classList.remove('is-selected'));
  if (!selected) keepsake.classList.add('is-selected');
}));
