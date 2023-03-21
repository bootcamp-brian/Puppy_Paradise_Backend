const express = require("express");
const { de } = require("faker/lib/locales");
const ordersRouter = express.Router();
const { getOrderById, getOrdersByUser, createOrder, addPuppyToOrder, getCartByUser, deleteCart, getUserByEmail, deleteCartItemsByPuppy, deletePuppy } = require('../db');
const { checkAuthorization } = require("./utils");

// GET /api/orders/:orderId
// Gets a specific order (must be an order that belongs to the logged in user)
ordersRouter.get('/:orderId', checkAuthorization, async (req, res, next) => {
    try {
        const params = req.params;
        const orderId = Number(params.orderId);
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
        const { id } = req.user;

        const orders = await getOrdersByUser({ id });

        res.send(orders);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/orders/guest
// Creates a new order for guest, and clears their cart
ordersRouter.post('/guest', async (req, res, next) => {
    try {
        const { orderItems, date } = req.body;

        if (!orderItems[0]) {
            res.status(400);
            next({
                error: '400',
                name: 'EmptyCartError',
                message: 'Your cart is empty'
            })
        }

        let total = 0;
        for (let item of orderItems) {
            if (!item.isAvailable) {
                res.status(400)
                next({
                    error:'400',
                    name: "PuppyUnavailableError",
                    message: `${item.name} is no longer available`,
                    puppyId: item.puppyId
                })
            }
            total += Number(item.price);
        }

        const status = "Created";

        const submittedOrder = await createOrder({ userId: 1, date, status, total });

        if (!submittedOrder.id) {
            res.status(400);
            next({
                error: '400',
                name: 'OrderCreationError',
                message: 'Unable to create order'
            })
        }

        for (let item of orderItems) {
            await addPuppyToOrder({ orderId: submittedOrder.id, puppyId: item.id });
            await deletePuppy(item.id);
        }

        const completedOrder = await getOrderById(submittedOrder.id);

        res.send(completedOrder);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// POST /api/orders
// Creates a new order for logged in user, and clears their cart
ordersRouter.post('/', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { date } = req.body;
        const orderItems = await getCartByUser(userId);

        if (!orderItems[0]) {
            res.status(400);
            next({
                error: '400',
                name: 'EmptyCartError',
                message: 'Your cart is empty'
            })
        }

        let total = 0;
        for (let item of orderItems) {
            if (!item.isAvailable) {
                deleteCartItemsByPuppy(item.puppyId)
                res.status(400)
                next({
                    error:'400',
                    name: "PuppyUnavailableError",
                    message: `${item.name} is no longer available`
                })
            }
            total += Number(item.price);
        }

        const status = "Created";

        const submittedOrder = await createOrder({ userId, date, status, total });

        if (!submittedOrder.id) {
            res.status(400);
            next({
                error: '400',
                name: 'OrderCreationError',
                message: 'Unable to create order'
            })
        }

        for (let item of orderItems) {
            await addPuppyToOrder({ orderId: submittedOrder.id, puppyId: item.puppyId });
            await deletePuppy(item.puppyId)
        }

        deleteCart(userId);

        const completedOrder = await getOrderById(submittedOrder.id);

        res.send(completedOrder);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

module.exports = ordersRouter;