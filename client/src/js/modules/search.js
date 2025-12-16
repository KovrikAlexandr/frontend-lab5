export function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function bindSearch(inputEl, callback, delay = 350) {
  if (!inputEl) return;
  const handler = debounce(() => {
    callback(inputEl.value.trim());
  }, delay);
  inputEl.addEventListener('input', handler);
}
