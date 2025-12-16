import { getProducts, getProduct, getFallbackProducts } from './services/productService.js';
import { submitOrder } from './services/apiService.js';
import {
  addItem,
  getCartItems,
  updateQuantity,
  removeItem,
  clearCart,
  getTotal,
} from './services/cartService.js';
import { renderCatalog } from './ui/renderCatalog.js';
import { renderProduct } from './ui/renderProduct.js';
import { renderCart, renderCheckoutSummary } from './ui/renderCart.js';
import { initFilters } from './modules/filters.js';
import { renderPagination } from './modules/pagination.js';
import { validateCheckout, renderFieldErrors } from './modules/formValidation.js';
import { getPage, getQueryParam } from './modules/router.js';

function showMessage(targetId, text, isError = false) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.textContent = text;
  target.classList.toggle('error', isError);
  target.classList.remove('hidden');
}

let toastTimer;
function showToast(text) {
  if (!text) return;
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  let toast = container.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    container.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

function flashButton(btn) {
  if (!btn) return;
  btn.classList.add('flash');
  setTimeout(() => btn.classList.remove('flash'), 400);
}

function initHome() {
  getProducts({ page: 1 })
    .then((data) => data.items?.slice(0, 4) || getFallbackProducts().slice(0, 4))
    .then((items) =>
      renderCatalog('popular-list', items, (product, button) => {
        addItem(product);
        flashButton(button);
        showToast('Добавлено в корзину');
      }),
    )
    .catch(() => {
      const items = getFallbackProducts().slice(0, 4);
      renderCatalog('popular-list', items, (product, button) => {
        addItem(product);
        flashButton(button);
        showToast('Добавлено в корзину');
      });
    });
}

function initCatalog() {
  const state = { page: 1, filters: {} };

  const loadCatalog = async () => {
    try {
      const payload = { ...state.filters, page: state.page, limit: 12 };
      if (state.filters.availability) payload.availability = true;
      const data = await getProducts(payload);
      const currentPage = data.page || state.page;
      renderCatalog('catalog-list', data.items || [], (product, button) => {
        addItem(product);
        flashButton(button);
        showToast('Добавлено в корзину');
      });
      renderPagination('pagination', data.totalPages || 1, currentPage, (page) => {
        state.page = page;
        loadCatalog();
      });
    } catch (err) {
      console.error(err);
    }
  };

  initFilters((filters) => {
    state.filters = filters;
    state.page = 1;
    loadCatalog();
  });

  loadCatalog();
}

function initProductPage() {
  const productId = getQueryParam('id');
  if (!productId) {
    showMessage('product-error', 'Товар не найден', true);
    return;
  }

  getProduct(productId)
    .then((product) => {
      renderProduct(product);
      const addBtn = document.getElementById('add-to-cart');
      const qtyEl = document.getElementById('product-qty');
      const decBtn = document.querySelector('[data-qty-dec]');
      const incBtn = document.querySelector('[data-qty-inc]');

      const setQty = (value) => {
        const safe = Math.max(1, Number(value) || 1);
        if (qtyEl) qtyEl.value = safe;
        return safe;
      };

      decBtn?.addEventListener('click', () => setQty((Number(qtyEl?.value) || 1) - 1));
      incBtn?.addEventListener('click', () => setQty((Number(qtyEl?.value) || 1) + 1));

      addBtn?.addEventListener('click', () => {
        const qty = setQty(qtyEl?.value);
        addItem(product, qty);
        flashButton(addBtn);
        showToast('Добавлено в корзину');
        showMessage('product-error', 'Товар добавлен в корзину', false);
      });
    })
    .catch((err) => {
      console.error(err);
      showMessage('product-error', 'Не удалось загрузить товар', true);
    });
}

function initCartPage() {
  const render = () => {
    const items = getCartItems();
    renderCart(items, {
      onUpdateQuantity: (id, qty) => {
        updateQuantity(id, qty);
        render();
      },
      onRemove: (id) => {
        removeItem(id);
        render();
      },
    });
  };
  render();
}

function initCheckoutPage() {
  const formEl = document.getElementById('checkout-form');
  if (!formEl) return;

  const renderSummary = () => {
    const items = getCartItems();
    renderCheckoutSummary(items);
    return items;
  };

  if (!getCartItems().length) {
    showMessage('checkout-message', 'Корзина пуста. Вернитесь в каталог.', true);
    return;
  }
  renderSummary();

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const items = getCartItems();
    if (!items.length) {
      showMessage('checkout-message', 'Корзина пуста. Вернитесь в каталог.', true);
      return;
    }

    const formData = {
      name: formEl.name.value.trim(),
      email: formEl.email.value.trim(),
      phone: formEl.phone.value.trim(),
    };

    const validation = validateCheckout(formData);
    renderFieldErrors(formEl, validation.errors);
    if (!validation.valid) return;

    const payload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      totalPrice: getTotal(),
    };

    try {
      await submitOrder(payload);
      clearCart();
      renderSummary();
      showMessage('checkout-message', 'Заказ отправлен. Проверьте почту!', false);
    } catch (err) {
      console.error(err);
      showMessage('checkout-message', 'Ошибка при отправке заказа', true);
    }
  });
}

const page = getPage();
switch (page) {
  case 'catalog':
    initCatalog();
    break;
  case 'product':
    initProductPage();
    break;
  case 'cart':
    initCartPage();
    break;
  case 'checkout':
    initCheckoutPage();
    break;
  default:
    initHome();
}
