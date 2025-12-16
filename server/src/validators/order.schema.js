import Joi from 'joi';

export const orderSchema = Joi.object({
  customer: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(5).required(),
  }).required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().integer().min(0).required(),
});
