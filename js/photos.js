(() => {
  const viewer = document.querySelector('[data-photo-viewer]');
  const buttons = [...document.querySelectorAll('[data-photo-open]')];
  if (!viewer || !buttons.length) return;

  const largeImage = viewer.querySelector('[data-photo-large]');
  const caption = viewer.querySelector('[data-photo-caption]');
  const count = viewer.querySelector('[data-photo-count]');
  let current = 0;

  function showPhoto(index) {
    current = (index + buttons.length) % buttons.length;
    const figure = buttons[current].closest('figure');
    const image = figure.querySelector('img');
    largeImage.src = image.src;
    largeImage.alt = image.alt;
    caption.textContent = figure.querySelector('figcaption').textContent;
    count.textContent = `${current + 1} / ${buttons.length}`;
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showPhoto(index);
      viewer.showModal();
    });
  });

  viewer.querySelector('[data-photo-close]').addEventListener('click', () => viewer.close());
  viewer.querySelector('[data-photo-prev]').addEventListener('click', () => showPhoto(current - 1));
  viewer.querySelector('[data-photo-next]').addEventListener('click', () => showPhoto(current + 1));
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(current - 1);
    if (event.key === 'ArrowRight') showPhoto(current + 1);
  });
})();
