const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

const checkAuthorization = async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) {
        res.status(401);
        next({
            error: '401',
            name: 'UnauthorizedError',
            message: 'You must be logged in to perform this action.'
        });
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ error, name, message }) {
        next({ error, name, message });
      }
    } else {
      res.status(401);
      next({
        error: '401',
        name: 'UnauthorizedError',
        message: 'You must be logged in to perform this action.'
      });
    }
}

const checkAdmin = async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) {
        res.status(401);
        next({
            error: '401',
            name: 'UnauthorizedError',
            message: 'You must be logged in to perform this action.'
        });
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id: userId } = jwt.verify(token, JWT_SECRET);
  
        if (userId) {
          // Need a function that searches admins table by userId and returns that row
          const admin = await getAdminById(userId);

          if (admin.id) {
            next();
          } else {
            res.status(401);
            next({
              error: '401',
              name: 'UnauthorizedAdminError',
              message: 'You must be an admin to perform this action.'
            });
          }
        }
      } catch ({ error, name, message }) {
        next({ error, name, message });
      }
    } else {
      res.status(401);
      next({
        error: '401',
        name: 'UnauthorizedError',
        message: 'You must be logged in to perform this action.'
      });
    }
}

module.exports = {
    checkAuthorization,
    checkAdmin
}