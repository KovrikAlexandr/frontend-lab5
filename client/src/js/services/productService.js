import { fetchProducts, fetchProduct } from './apiService.js';

const fallbackProducts = [
  {
    id: 1,
    title: "Let's Dance",
    artist: 'David Bowie',
    genre: 'rock',
    price: 4200,
    stock: 10,
    description: 'Коммерчески самый успешный альбом Дэвида Боуи.',
    cover_url: '/images/bowie.png',
  },
  {
    id: 2,
    title: 'Zenyatta Mondatta',
    artist: 'The Police',
    genre: 'rock',
    price: 3900,
    stock: 8,
    description: 'Третий студийный альбом The Police.',
    cover_url: '/images/police.png',
  },
  {
    id: 3,
    title: 'Led Zeppelin IV',
    artist: 'Led Zeppelin',
    genre: 'rock',
    price: 4600,
    stock: 6,
    description: 'Один из самых известных альбомов в истории рока.',
    cover_url: '/images/ledzeppelin.png',
  },
];


function applyFallbackFilters(params = {}) {
  const limit = Number(params.limit) || 9;
  const page = Math.max(Number(params.page) || 1, 1);
  const textMatch = (value, search) => value.toLowerCase().includes((search || '').toLowerCase());

  let items = [...fallbackProducts];

  if (params.genre) {
    items = items.filter((p) => textMatch(p.genre, params.genre));
  }
  if (params.artist) {
    items = items.filter((p) => textMatch(p.artist, params.artist));
  }
  if (params.search) {
    items = items.filter((p) => textMatch(p.title, params.search) || textMatch(p.artist, params.search));
  }
  if (params.minPrice) {
    items = items.filter((p) => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    items = items.filter((p) => p.price <= Number(params.maxPrice));
  }
  if (params.availability === true || params.availability === 'true') {
    items = items.filter((p) => p.stock > 0);
  }

  switch (params.sort) {
    case 'price-asc':
      items.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      items.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      items.sort((a, b) => b.id - a.id);
      break;
    default:
      break;
  }

  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const sliceStart = (page - 1) * limit;
  const sliceEnd = sliceStart + limit;

  return {
    items: items.slice(sliceStart, sliceEnd),
    total,
    page,
    totalPages,
  };
}

export async function getProducts(params = {}) {
  return applyFallbackFilters(params); // Потом заменю на вызов в бекенд
}

export async function getProduct(id) {
  const numericId = Number(id);
  try {
    return await fetchProduct(id);
  } catch (err) {
    console.warn('API недоступен, используется тестовый товар', err);
    return fallbackProducts.find((p) => p.id === numericId);
  }
}

export function getFallbackProducts() {
  return fallbackProducts;
}
