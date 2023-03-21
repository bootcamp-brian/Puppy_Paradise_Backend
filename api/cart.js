const express = require("express");
const cartRouter = express.Router();
const { getCartByUser, getCartItemById, deleteCartItem, getPuppyById, addItemToCart, deleteCart } = require('../db');
const { checkAuthorization } = require("./utils");
const stripe = require('stripe')('sk_test_51MnTRwC3qhij2vZlCUNW9BmfKG2Uop8Lu2c9ov17mxxBf5EW4O1mvd9uKrlzW5CJo42ooGzIq2d5cyYlaG1pTbz8008PtPRdF3');

// GET /api/cart/stripe/:checkoutId
// Gets stripe response
cartRouter.get('/stripe/:checkoutId', async (req, res, next) => {
    try {
        const { checkoutId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(
            checkoutId
        );
        
        res.send({session});
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// GET /api/cart
// Gets a logged in user's cart
cartRouter.get('/', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        const cartItems = await getCartByUser(userId);
        let subtotal = 0;
        for (let item of cartItems) {
            subtotal += Number(item.price);
        }
        const cart = {
            cartItems,
            subtotal
        }

        res.send(cart);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/cart/puppies/:puppyId
// Adds a specific puppy to the logged in user's cart
cartRouter.patch('/puppies/:puppyId', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const params = req.params;
        const puppyId = Number(params.puppyId);
        const puppy = await getPuppyById(puppyId);

        if (puppy.isAvailable) {
            const cartItem = await addItemToCart({ userId, puppyId });
    
            res.send(cartItem);
        } else {
            res.status(404);
            next({
                error: '404',
                name: 'PuppyNotAvailableError',
                message: 'Puppy not available'
            })
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// DELETE /api/cart/:cartItemId
// Removes an item from the logged in user's cart
cartRouter.delete('/:cartItemId', checkAuthorization, async (req, res, next) => {
    try {
        const params = req.params;
        const cartItemId = Number(params.cartItemId);
        const cartItem = await getCartItemById(cartItemId);

        if (cartItem.id) {
            const deletedCartItem = await deleteCartItem(cartItemId);
    
            res.send(deletedCartItem);
        } else {
            res.status(404);
            next({
                error: '404',
                name: 'CartItemNotFoundError',
                message: 'Cart item not found'
            })
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// DELETE /api/cart/
// Clears a logged in user's entire cart
cartRouter.delete('/', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        const deletedCart = await deleteCart(userId);

        res.send(deletedCart);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

module.exports = cartRouter;