const express = require("express");
const ordersRouter = express.Router();
const { getOrderById, getOrdersByUser, createOrder, addPuppyToOrder, getCartByUser } = require('../db');
const { checkAuthorization } = require("./utils");

// GET /api/orders/:orderId
// Gets a specific order (must be an order that belongs to the logged in user)
ordersRouter.get('/', checkAuthorization, async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { id: userId } = req.user;

        const order = await getOrderById(orderId);

        if (!order) {
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
// Creates a new order for logged in user, and clears their cart
ordersRouter.post('', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { date, status, total } = req.body;
        const submittedOrder = await createOrder({ userId, date, status, total });
        const orderItems = await getCartByUser(userId);

        if (!orderItems[0]) {
            res.status(400);
            next({
                error: '400',
                name: 'EmptyCartError',
                message: 'Your cart is empty'
            })
        }
        if (!submittedOrder.id) {
            res.status(400);
            next({
                error: '400',
                name: 'OrderCreationError',
                message: 'Unable to create order'
            })
        }

        for (let item of orderItems) {
            addPuppyToOrder(submittedOrder.id, item.id);
        }

        deleteCart(userId);

        const completedOrder = await getOrderById(submittedOrder.id);

        res.send(completedOrder);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

module.exports = ordersRouter;