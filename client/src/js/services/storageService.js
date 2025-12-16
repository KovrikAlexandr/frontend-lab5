const isBrowser = typeof window !== 'undefined';

export function getItem(key, fallback = null) {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn('Storage read failed', err);
    return fallback;
  }
}

export function setItem(key, value) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage write failed', err);
  }
}

export function removeItem(key) {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}
