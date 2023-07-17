import express from 'express';
import stripe from 'stripe';

const stripeInstance = stripe('sk_test_51NHm63EADHkwdhYu1vprTHX1XARsTNzfQtDxAEIWh9pvhf9NUBjTqm7VpwIlyoNlzVX6mPGwdoyNEJQ6GjaPwMmm00NawFCMfl');

const stripeRoutes = express.Router();

stripeRoutes.post('/create-checkout-session', async (req, res) => {
  const cartItems = req.body.cart;
  const totalAmount = getTotal(cartItems); // Calcular el total gastado en el carrito

  let shippingRate = "shr_1NHnr0EADHkwdhYurtapc4x5";

  if (totalAmount < 19.99) {
    shippingRate = 'shr_1NHnpxEADHkwdhYu6Kh7qqWq'; // ID de la tarifa de envío de 9.99€
  } else if (totalAmount < 29.99) {
    shippingRate = 'shr_1NHnqYEADHkwdhYuOtppG4Xn'; // ID de la tarifa de envío de 7.99€
  } else if (totalAmount < 49.99) {
    shippingRate = 'shr_1NHnqmEADHkwdhYu47L8BOiH'; // ID de la tarifa de envío de 4.99€
  }

  const lineItems = cartItems.map((item) => {
    return {
      price: item.precioID,
      quantity: item.quantity,
    };
  });

  const session = await stripeInstance.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ['ES'],
    },
    shipping_options: [
      {
        shipping_rate: shippingRate,
      },
     
    ],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:3000/',
    cancel_url: 'http://localhost:3000/prueba',
  
  });

  res.send({ url: session.url });
});

function getTotal(cartItems) {
  // Implementar la lógica para calcular el total a partir de los elementos del carrito
  let total = 0;
  cartItems.forEach((item) => {
    total += item.precio * item.quantity;
  });
  return total;
}

export default stripeRoutes;
