export function renderCart(items = [], { onUpdateQuantity, onRemove }) {
  const listEl = document.getElementById('cart-list');
  const emptyEl = document.getElementById('cart-empty');
  const totalEl = document.getElementById('cart-total');
  const summaryEl = document.getElementById('cart-summary');

  if (!listEl) return;
  listEl.innerHTML = '';

  if (!items.length) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (summaryEl) summaryEl.classList.add('hidden');
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');
  if (summaryEl) summaryEl.classList.remove('hidden');

  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div>
        <h3>${item.title}</h3>
        <p class="muted">${item.artist}</p>
      </div>
      <strong>${item.price} ₽</strong>
      <div class="qty-control">
        <button class="qty-btn" data-action="dec" aria-label="Уменьшить">-</button>
        <input type="number" min="1" value="${item.quantity}" aria-label="Количество" />
        <button class="qty-btn" data-action="inc" aria-label="Увеличить">+</button>
      </div>
      <button class="btn ghost icon-btn" title="Удалить" aria-label="Удалить из корзины">×</button>
    `;

    const qtyInput = el.querySelector('input');
    const decBtn = el.querySelector('[data-action="dec"]');
    const incBtn = el.querySelector('[data-action="inc"]');

    const update = (val) => {
      const safeVal = Math.max(1, Number(val) || 1);
      qtyInput.value = safeVal;
      onUpdateQuantity?.(item.id, safeVal);
    };

    qtyInput.addEventListener('change', () => update(qtyInput.value));
    decBtn.addEventListener('click', () => update(Number(qtyInput.value) - 1));
    incBtn.addEventListener('click', () => update(Number(qtyInput.value) + 1));

    el.querySelector('.icon-btn').addEventListener('click', () => onRemove?.(item.id));
    listEl.appendChild(el);
  });

  if (totalEl) {
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    totalEl.textContent = `${total} ₽`;
  }
}

export function renderCheckoutSummary(items = []) {
  const itemsContainer = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');
  if (itemsContainer) {
    itemsContainer.innerHTML = '';
    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'summary-row';
      row.textContent = `${item.title} × ${item.quantity}`;
      const price = document.createElement('strong');
      price.textContent = `${item.price * item.quantity} ₽`;
      row.appendChild(price);
      itemsContainer.appendChild(row);
    });
  }
  if (totalEl) {
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    totalEl.textContent = `${total} ₽`;
  }
}
