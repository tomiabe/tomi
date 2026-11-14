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
    projects.slice(visibleCount).forEach((project) => {
      project.hidden = false;
    });
    loadMore.hidden = true;
  });
})();
