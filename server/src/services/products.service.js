import pool from '../db/index.js';

export async function listProducts(filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.genre) {
    values.push(`%${filters.genre}%`);
    conditions.push(`genre ILIKE $${values.length}`);
  }

  if (filters.artist) {
    values.push(`%${filters.artist}%`);
    conditions.push(`artist ILIKE $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(title ILIKE $${values.length} OR artist ILIKE $${values.length})`);
  }

  if (filters.minPrice) {
    values.push(Number(filters.minPrice));
    conditions.push(`price >= $${values.length}`);
  }

  if (filters.maxPrice) {
    values.push(Number(filters.maxPrice));
    conditions.push(`price <= $${values.length}`);
  }

  if (filters.availability === 'true' || filters.availability === true) {
    conditions.push('stock > 0');
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const totalResult = await pool.query(`SELECT COUNT(*) AS count FROM products ${whereClause}`, values);
  const total = Number(totalResult.rows[0].count) || 0;

  const limit = Number(filters.limit) || 9;
  const page = Math.max(Number(filters.page) || 1, 1);
  const offset = (page - 1) * limit;

  let orderClause = 'ORDER BY created_at DESC';
  switch (filters.sort) {
    case 'price-asc':
      orderClause = 'ORDER BY price ASC';
      break;
    case 'price-desc':
      orderClause = 'ORDER BY price DESC';
      break;
    case 'newest':
      orderClause = 'ORDER BY created_at DESC';
      break;
    default:
      break;
  }

  const limitIndex = values.length + 1;
  const offsetIndex = values.length + 2;
  const itemsResult = await pool.query(
    `SELECT * FROM products ${whereClause} ${orderClause} LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    [...values, limit, offset],
  );

  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    items: itemsResult.rows,
    total,
    page,
    totalPages,
  };
}

export async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}
