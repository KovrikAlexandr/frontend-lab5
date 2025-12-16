import pool from '../db/index.js';

export async function createOrder(order) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let computedTotal = 0;
    for (const item of order.items) {
      const productRes = await client.query('SELECT id, price, stock FROM products WHERE id = $1', [item.productId]);
      const product = productRes.rows[0];
      if (!product) {
        throw new Error(`Товар ${item.productId} не найден`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Недостаточно стока для товара ${item.productId}`);
      }
      computedTotal += product.price * item.quantity;
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.productId]);
    }

    const totalPrice = computedTotal;
    const orderRes = await client.query(
      `
      INSERT INTO orders (customer_name, customer_email, customer_phone, total_price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [order.customer.name, order.customer.email, order.customer.phone, totalPrice],
    );
    const savedOrder = orderRes.rows[0];

    for (const item of order.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [savedOrder.id, item.productId, item.quantity],
      );
    }

    await client.query('COMMIT');
    return savedOrder;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
