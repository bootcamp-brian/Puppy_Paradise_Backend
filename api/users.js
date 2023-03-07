const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_SECRET_ADMIN } = process.env;
const { createUser, getUser, updateUser, getUserByEmail, getUserById, getResetUserById, deleteResetUser, getAdminById } = require('../db');
const { checkAuthorization } = require("./utils");

// POST /api/users/register
// Registers a user
usersRouter.post('/register', async (req, res, next) => {
    const {
        firstName,
        lastName,
        password,
        phone,
        email,
        shippingAddress,
        billingAddress
    } = req.body;
  
    try {
      const _user = await getUserByEmail(email);
  
      if (_user) {
        res.status(403);
        next({
            error: '403',
            name: 'EmailInUseError',
            message: `${email} is already registered.`
        });
      }
  
      if (password.length < 8) {
        res.status(400);
        next({
            error: '400',
            name: 'PasswordTooShortError',
            message: 'Password too short!'
        })
      }

      const user = await createUser({
        firstName,
        lastName,
        password,
        phone,
        email,
        shippingAddress,
        billingAddress
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        email
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
// Logs in a user
usersRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await getUser({ email, password });
        const resetUser = getResetUserById(user.id);

        if (!resetUser) {
            res.send({
                message: "Please reset your password",
                userId: user.id,
                needsReset: true
            });
        }

        if (!user) {
            res.status(400);
            next({
                error: '400',
                name: 'IncorrectCredentialsError',
                message: 'Incorrect email or password'
            });
        }

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
        const admin = await getAdminById(user.id);

        if(admin) {
            const adminToken = jwt.sign({ id: user.id, email }, JWT_SECRET_ADMIN);
            res.send({
                message: "you're logged in!",
                token,
                adminToken,
                user
            });
        } else {
            res.send({ 
            message: "you're logged in!",
            token,
            user 
            });
        }
        
    } catch ({ error, name, message }) {
      next({ error, name, message });
    } 
});

// DELETE /api/users/password_reset/:userId
// Removes user from the reset_users table and updates their password
usersRouter.delete('/password_reset/:userId', async (req, res, next) => {
    try {
        const { password } = req.body;
        const { userId } = req.params;

        const user = deleteResetUser(userId, password);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            });
        } else {
            res.send(user);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/users/me
// Gets a logged in user's info
usersRouter.get('/me', checkAuthorization, async (req, res, next) => {
    try {
        res.send(req.user);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/users/me
// Edits a logged in user's info
usersRouter.patch('/me', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user
        const { ...fields } = req.body;

        const user = await getUserById(userId);

        if (!user) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else if (req.body.email) {
            const userByEmail = await getUserByEmail(req.body.email);

            if (userByEmail.id && userByEmail.id !== userId) {
                res.status(400);
                next({
                    error: '400',
                    name: 'EmailInUseError',
                    message: 'That email is already in use'
                })
            } else {
                const updatedUser = await updateUser({ userId, ...fields });
    
                if (!updatedUser.id) {
                    next({
                        error: '400',
                        name: 'UserUpdateError',
                        message: 'Unable to update user info'
                    })
                } else {
                    res.send(updatedUser);
                }
            }
        } else {
            const updatedUser = await updateUser({ userId, ...fields });

            if (!updatedUser.id) {
                res.status(400);
                next({
                    error: '400',
                    name: 'UserUpdateError',
                    message: 'Unable to update user info'
                })
            } else {
                res.send(updatedUser);
            }
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = usersRouter;