function createTile(product, onAddToCart) {
  const card = document.createElement('article');
  card.className = 'card product-tile';
  const cover = product.cover_url || '';
  card.innerHTML = `
    <div class="cover" style="background-image: url('${cover}')"></div>
    <div>
      <p class="eyebrow">${product.genre || 'жанр'}</p>
      <h3>${product.title}</h3>
      <p class="muted">${product.artist}</p>
    </div>
    <div class="product-price">${product.price} ₽</div>
    <div class="product-actions">
      <a class="btn ghost" href="/product.html?id=${product.id}">Подробнее</a>
      <button class="btn primary" data-add="${product.id}">В корзину</button>
    </div>
  `;

  const addButton = card.querySelector('[data-add]');
  if (addButton) {
    addButton.addEventListener('click', () => onAddToCart?.(product, addButton));
  }

  return card;
}

export function renderCatalog(targetId, items = [], onAddToCart) {
  const target = document.getElementById(targetId);
  const emptyEl = document.getElementById('catalog-empty');
  if (!target) return;

  target.innerHTML = '';
  if (!items.length) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  items.forEach((product) => {
    target.appendChild(createTile(product, onAddToCart));
  });
}
