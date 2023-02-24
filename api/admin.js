/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getAllUsers } = require('../db');
const { checkAdmin } = require("./utils");

// GET /api/admin/user_list
adminRouter.get('/user_list', checkAdmin, async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.send(users);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = usersRouter;