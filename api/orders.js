const express = require("express");
const ordersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getOrderById, getOrdersByUser, createOrder } = require('../db');
const { checkAuthorization } = require("./utils");

// GET /api/orders/:orderId
// Gets a specific order (must be an order that belongs to the logged in user)
ordersRouter.get('/', checkAuthorization, async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { id: userId } = req.user;

        const order = await getOrderById(orderId);

        if (!order.id) {
            res.status(400);
            next({
                error: '404',
                name: 'OrderNotFoundError',
                message: 'Order not found'
            })
        } else if (order.userId !== userId) {
            res.status(401);
            next({
              error: '401',
              name: 'UnauthorizedError',
              message: 'You do not have access to that order'
            });
        } else {
            res.send(order);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/orders
// Gets all orders of logged in user
ordersRouter.get('/', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        const orders = await getOrdersByUser(userId);

        res.send(orders);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/orders
// Creates a new order for logged in user
ordersRouter.post('', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { date, status } = req.body;
        const order = createOrder({ userId, date, status });

        if (!order.id) {
            res.status(400);
            next({
                error: '400',
                name: 'OrderCreationError',
                message: 'Unable to create order'
            })
        }

        res.send(order);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

module.exports = ordersRouter;