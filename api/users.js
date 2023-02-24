/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { createUser, getUser, getOrderItemsByUser, updateUser } = require('../db');
const { checkAuthorization } = require("./utils");

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const _user = await getUserByEmail(email);
  
      if (_user) {
        next({
            error: '403',
            name: 'EmailInUseError',
            message: `${email} is already registered.`
        });
      }
  
      if (password.length < 8) {
        next({
            error: '400',
            name: 'PasswordTooShortError',
            message: 'Password too short!'
        })
      }

      const user = await createUser({ email, password });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "you're signed up!",
        token,
        user 
      });
    } catch ({ error, name, message }) {
      next({ error, name, message });
    } 
  });

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await getUser({ email, password });

        if (!user) {
            next({
                error: '400',
                name: 'IncorrectCredentials Error',
                message: 'Incorrect email or password'
            })
        }
        
        const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
        res.send({ 
            message: "you're logged in!",
            token,
            user 
        });
    } catch ({ error, name, message }) {
      next({ error, name, message });
    } 
});

// GET /api/users/cart
usersRouter.get('/user_list', checkAuthorization, async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.send(users);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/users/me/orders
// Need to discuss some database stuff for this one
// usersRouter.get('/me/orders', checkAuthorization, async (req, res, next) => {
//     try {

//     } catch ({ error, name, message }) {
//         next({ error, name, message });
//     } 
// })

// GET /api/users/me
usersRouter.get('/me', checkAuthorization, async (req, res, next) => {
    try {
        res.send(req.user);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/users/me
usersRouter.patch('/me', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { ...fields } = req.body;

        if (req.body.email) {
            const user = await getUserByEmail(req.body.email);

            if (user.id) {
                res.status(404);
                next({
                    error: '404',
                    name: 'RoutineNotFoundError',
                    message: 'Routine not found'
                })
            } else {
                const updatedUser = await updateUser({ id, ...fields });
    
                res.send(updatedUser);
            }
        } else {
            const updatedUser = await updateUser({ id, ...fields });

            res.send(updatedUser);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = usersRouter;