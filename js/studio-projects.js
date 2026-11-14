(() => {
  const list = document.querySelector('#studio-project-list');
  const loadMore = document.querySelector('.studio-load-more');

  if (!list || !loadMore) return;

  const projects = [...list.querySelectorAll('.studio-project')];
  const visibleCount = 10;

  if (projects.length <= visibleCount) return;

  projects.slice(visibleCount).forEach((project) => {
    project.hidden = true;
  });
  loadMore.hidden = false;

  loadMore.addEventListener('click', () => {
    const expanded = loadMore.getAttribute('aria-expanded') === 'true';
    projects.slice(visibleCount).forEach((project) => {
      project.hidden = expanded;
    });
    loadMore.setAttribute('aria-expanded', String(!expanded));
    loadMore.textContent = expanded ? 'Show more' : 'Show less';
  });
})();
