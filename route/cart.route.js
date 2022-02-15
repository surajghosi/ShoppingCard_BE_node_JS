const express = require('express');
const router = express.Router();

const cartController = require('../controller/cart.controller');
const authController = require('../controller/auth.controller');

/* Show Cart API route which is used to list cart items */
router.get('/showCart', authController.auth, cartController.showCart);

/* Add to Cart API route which is used to add to cart items */
router.post('/addToCart', authController.auth, cartController.addToCart);

/* Remove from Cart API route which is used to remove specific cart items */
router.delete('/removeFromCart/:id', authController.auth, cartController.removeFromCart);

/* Update Cart API route which is used to update cart items */
router.put('/updateCart', authController.auth, cartController.updateCart);

module.exports = router;