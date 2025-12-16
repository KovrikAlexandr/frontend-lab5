export function renderPagination(containerId, totalPages = 1, currentPage = 1, onChange = () => {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  if (totalPages <= 1) return;

  for (let page = 1; page <= totalPages; page += 1) {
    const btn = document.createElement('button');
    btn.textContent = page;
    if (page === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => onChange(page));
    container.appendChild(btn);
  }
}
