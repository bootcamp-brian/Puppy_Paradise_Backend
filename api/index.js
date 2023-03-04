const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/health', async (req, res, next) => {
    try {
        res.send({ message: "All is well" });
    } catch (error) {
        next(error);
    }
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/puppies
const puppiesRouter = require('./puppies');
router.use('/puppies', puppiesRouter);

// ROUTER: /api/cart
const cartRouter = require('./cart');
router.use('/cart', cartRouter);

// ROUTER: /api/orders
const ordersRouter = require('./orders');
router.use('/orders', ordersRouter);

// ROUTER: /api/admin
const adminRouter = require('./admin');
router.use('/admin', adminRouter);

// error handling middleware
router.use((error, req, res, next) => {
    res.send({
        error: error.error,
        name: error.name,
        message: error.message
    });
});

router.use((req, res, next) => {
    res.status(404).send({
        error: '404',
        name: 'PageNotFoundError',
        message: 'Page not found'
    })
  })

module.exports = router;
