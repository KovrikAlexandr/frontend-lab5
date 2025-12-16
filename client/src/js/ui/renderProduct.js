export function renderProduct(product) {
  const titleEl = document.getElementById('product-title');
  const artistEl = document.getElementById('product-artist');
  const genreEl = document.getElementById('product-genre');
  const descEl = document.getElementById('product-description');
  const priceEl = document.getElementById('product-price');
  const stockEl = document.getElementById('product-stock');
  const coverEl = document.querySelector('.product-cover');

  if (!product) {
    document.getElementById('product-error')?.classList.remove('hidden');
    return;
  }

  const setText = (el, value) => {
    if (!el) return;
    el.classList.remove('skeleton');
    el.textContent = value;
  };

  setText(titleEl, product.title);
  setText(artistEl, product.artist);
  setText(genreEl, product.genre);
  setText(descEl, product.description || 'Описание отсутствует');
  setText(priceEl, `${product.price} ₽`);
  setText(stockEl, product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии');

  if (coverEl) {
    coverEl.classList.remove('shimmer');
    coverEl.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.25)), url('${product.cover_url || ''}')`;
    coverEl.style.backgroundSize = 'cover';
    coverEl.style.backgroundPosition = 'center';
  }
}
