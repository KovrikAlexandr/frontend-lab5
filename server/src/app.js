import express from 'express';
import cors from 'cors';

import productsRouter from './routes/products.routes.js';
import ordersRouter from './routes/orders.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
