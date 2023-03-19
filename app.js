require("dotenv").config()
const express = require("express")
const app = express()

app.use(express.static('public'));

// Setup your Middleware and API Router here
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const apiRouter = require('./api');
app.use('/api', apiRouter);

module.exports = app;
