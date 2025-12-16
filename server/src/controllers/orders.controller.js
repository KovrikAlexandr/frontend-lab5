import { orderSchema } from '../validators/order.schema.js';
import { createOrder } from '../services/orders.service.js';

export async function createOrderHandler(req, res, next) {
  const { error, value } = orderSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  try {
    const order = await createOrder(value);
    return res.status(201).json(order);
  } catch (err) {
    if (err.message?.includes('стока') || err.message?.includes('не найден')) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
}
