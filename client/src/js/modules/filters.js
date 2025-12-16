import { bindSearch } from './search.js';

export function initFilters(onChange) {
  const state = {
    search: '',
    genre: '',
    artist: '',
    minPrice: '',
    maxPrice: '',
    availability: false,
    sort: '',
  };

  const apply = () => onChange({ ...state });

  bindSearch(document.getElementById('search'), (value) => {
    state.search = value;
    apply();
  });

  const genreEl = document.getElementById('genre');
  if (genreEl) {
    genreEl.addEventListener('change', () => {
      state.genre = genreEl.value;
      apply();
    });
  }

  const artistEl = document.getElementById('artist');
  if (artistEl) {
    artistEl.addEventListener('change', () => {
      state.artist = artistEl.value.trim();
      apply();
    });
  }

  const minPriceEl = document.getElementById('minPrice');
  const maxPriceEl = document.getElementById('maxPrice');
  [minPriceEl, maxPriceEl].forEach((el) => {
    if (!el) return;
    el.addEventListener('change', () => {
      state.minPrice = minPriceEl?.value || '';
      state.maxPrice = maxPriceEl?.value || '';
      apply();
    });
  });

  const availabilityEl = document.getElementById('availability');
  if (availabilityEl) {
    availabilityEl.addEventListener('change', () => {
      state.availability = availabilityEl.checked;
      apply();
    });
  }

  const sortEl = document.getElementById('sort');
  if (sortEl) {
    sortEl.addEventListener('change', () => {
      state.sort = sortEl.value;
      apply();
    });
  }

  return state;
}
