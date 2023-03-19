require("dotenv").config()
const express = require("express")
const app = express()

// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MnTRwC3qhij2vZlCUNW9BmfKG2Uop8Lu2c9ov17mxxBf5EW4O1mvd9uKrlzW5CJo42ooGzIq2d5cyYlaG1pTbz8008PtPRdF3');
app.use(express.static('public'));

const YOUR_DOMAIN = 'https://puppy-paradise-api.onrender.com';

app.post('/create-checkout-session', async (req, res) => {
    const { cartItems } = req.body;

    const line_items = cartItems.map(item => {
        const line_item = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.breed,
                    images: item.image1
                },
                unit_amount_decimal: Number(item.price)
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

    res.send(303, session.url);
});

// Setup your Middleware and API Router here
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const apiRouter = require('./api');
app.use('/api', apiRouter);

module.exports = app;
