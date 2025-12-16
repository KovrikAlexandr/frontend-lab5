export function getPage() {
  return document.body?.dataset?.page || 'home';
}

export function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}
