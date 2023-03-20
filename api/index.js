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

// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MnTRwC3qhij2vZlCUNW9BmfKG2Uop8Lu2c9ov17mxxBf5EW4O1mvd9uKrlzW5CJo42ooGzIq2d5cyYlaG1pTbz8008PtPRdF3');
const YOUR_DOMAIN = process.env.SITE_DOMAIN || 'http://localhost:3000';

router.post('/create-checkout-session', async (req, res) => {
    const { cartItems } = req.body;
    
    const line_items = cartItems.map(item => {
        const line_item = {
            price_data: {
                currency: 'usd',
                product_data: item.image1 ? {
                    name: item.name,
                    description: item.breed,
                    images: [item.image1]
                }
                :
                {
                    name: item.name,
                    description: item.breed
                },
                unit_amount_decimal: Number(item.price) * 100
            },
            quantity: 1,
        }

        return line_item;
    }) 
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.send({session, YOUR_DOMAIN})
    res.redirect(303, session.url);
});

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
