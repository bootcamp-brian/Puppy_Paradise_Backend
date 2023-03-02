const express = require("express");
const cartRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getCartByUser, getCartItemById, deleteCartItem, getPuppyById, addItemToCart, deleteCart } = require('../db');
const { checkAuthorization } = require("./utils");

// GET /api/cart
// Gets a logged in user's cart
cartRouter.get('/', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        const cart = await getCartByUser(userId);

        res.send(cart);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/cart/puppies/:puppyId
// Adds a specific puppy to the logged in user's cart
cartRouter.post('/puppies/:puppyId', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { puppyId } = req.params;
        const puppy = await getPuppyById(puppyId);

        if (puppy.id) {
            const cartItem = await addItemToCart({ userId, puppyId });
    
            res.send(cartItem);
        } else {
            res.status(404);
            next({
                error: '404',
                name: 'PuppyNotFoundError',
                message: 'Puppy not found'
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
        const { id: userId } = req.user;
        const { cartItemId } = req.params;
        const cartItem = await getCartItemById(cartItemId);

        if (cartItem.id) {
            const deletedCartItem = await deleteCartItem({ userId, puppyId });
    
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
modules.export = cartRouter;