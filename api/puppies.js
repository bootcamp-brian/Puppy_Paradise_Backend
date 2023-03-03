const express = require("express");
const puppiesRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getAvailablePuppies, getPuppyById, getAllCategories, getAllTaggedPuppies } = require('../db');
const { checkAuthorization } = require("./utils");

// GET /api/puppies/categories
// Gets all puppy categories
puppiesRouter.get('/categories', async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.send(categories);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/puppies/tagged_puppies/:categoryId
// Gets all puppies tagged with a specific category
puppiesRouter.get('/tagged_puppies/:categoryId', async (req, res, next) => {
    try {
        const params = req.params;
        const categoryId = Number(params.categoryId);
        const taggedPuppies = await getAllTaggedPuppies();

        const categoryPuppies = taggedPuppies.filter(puppy => {
            if (puppy.categoryId === categoryId) {
                return true;
            }
        });

        res.send(categoryPuppies);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/puppies/tagged_puppies
// Gets all tagged puppies (puppies that have been categorized)
puppiesRouter.get('/tagged_puppies', async (req, res, next) => {
    try {
        const taggedPuppies = await getAllTaggedPuppies();
        res.send(taggedPuppies);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/puppies/:puppyId
// Gets specific puppy
puppiesRouter.get('/:puppyId', async (req, res, next) => {
    try {
        const { puppyId } = req.params;
        const puppy = await getPuppyById(puppyId);

        if (!puppy.id) {
            res.status(404);
            next({
                error: '404',
                name: 'PuppyNotFoundError',
                message: 'Puppy not found'
            })
        }

        res.send(puppy);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/puppies
// gets all available puppies
puppiesRouter.get('/', async (req, res, next) => {
    try {
        const puppies = await getAvailablePuppies();
        res.send(puppies);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = puppiesRouter;