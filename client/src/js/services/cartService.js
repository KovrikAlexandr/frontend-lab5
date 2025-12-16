import { getItem, setItem, removeItem as removeStorageItem } from './storageService.js';

const CART_KEY = 'vinyl-cart';

function persist(items) {
  setItem(CART_KEY, items);
  return items;
}

export function getCartItems() {
  return getItem(CART_KEY, []);
}

export function addItem(product, quantity = 1) {
  const items = getCartItems();
  const existing = items.find((it) => it.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id: product.id,
      title: product.title,
      artist: product.artist,
      price: product.price,
      cover_url: product.cover_url,
      quantity,
    });
  }
  return persist(items);
}

export function updateQuantity(productId, quantity) {
  let items = getCartItems();
  items = items
    .map((it) => (it.id === productId ? { ...it, quantity: Math.max(1, quantity) } : it))
    .filter((it) => it.quantity > 0);
  return persist(items);
}

export function removeItem(productId) {
  const items = getCartItems().filter((it) => it.id !== productId);
  return persist(items);
}

export function clearCart() {
  removeStorageItem(CART_KEY);
}

export function getTotal() {
  return getCartItems().reduce((sum, it) => sum + it.price * it.quantity, 0);
}
