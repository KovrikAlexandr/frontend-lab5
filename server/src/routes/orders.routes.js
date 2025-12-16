import { Router } from 'express';
import { createOrderHandler } from '../controllers/orders.controller.js';

const router = Router();

router.post('/', createOrderHandler);

export default router;
