import { listProducts, getProductById } from '../services/products.service.js';

export async function getProducts(req, res, next) {
  try {
    const data = await listProducts(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
    return next(err);
  }
}
