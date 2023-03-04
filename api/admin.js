/* eslint-disable no-useless-catch */
const express = require("express");
const adminRouter = express.Router();
const {
    getAllUsers,
    getAllOrders,
    getUserById,
    getUserByEmail,
    updateUser,
    createAdmin,
    createResetUser,
    createInactiveUser,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    createPuppy,
    updatePuppy,
    deletePuppy,
    getCategoryById,
    getPuppyById,
    addPuppyToCategory,
    createCategory,
    updateStatus,
    getAllInactiveUsers,
    deleteInactiveUser,
    deletePuppyFromCategory,
    deleteCategory
} = require('../db');
const { checkAdmin } = require("./utils");

// Checks if the user is an admin before running any of the below routes
// alternative to putting checkAdmin in each route
adminRouter.use('/', checkAdmin)

// --- Admin functionality for users ---

// GET /api/admin/users/:userId
// Lets admin view specific user
adminRouter.get('/users/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            res.send(user);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/admin/users/inactive
adminRouter.get('/users/inactive', async (req, res, next) => {
    try {
        const inactiveUsers = await getAllInactiveUsers();

        res.send(inactiveUsers);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/admin/users
// Lets admin view all users
adminRouter.get('/users', async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.send(users);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/users/:userId
// Lets admin edit a specific user's info
adminRouter.patch('/users/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { ...fields } = req.body;

        const user = await getUserById(userId);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        }

        if (req.body.email) {
            const userByEmail = await getUserByEmail(req.body.email);

            if (userByEmail.id && userByEmail.id !== userId) {
                res.status(403);
                next({
                    error: '403',
                    name: 'EmailInUseError',
                    message: 'That email is already in use'
                })
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

// PATCH /api/admin/users/promote/:userId
// Lets admin promote a specific user to admin status
adminRouter.patch('/users/promote/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            // need a function that adds a row to admins table using the userId parameter to fill in the "userId" column
            const newAdmin = createAdmin(userId);
            res.send(newAdmin);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/users/reset/:userId
// Lets admin set a specific user to require a password reset
adminRouter.patch('/users/reset/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            // need a function that adds a row to reset_users table using the userId parameter to fill in the "userId" column
            const targetUser = createResetUser(userId);
            res.send(targetUser);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/admin/users/reactivate/:userId
// Lets admin reactivate an inactive user
adminRouter.post('/users/reactivate/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            const reactivatedUser = deleteInactiveUser(userId);
            res.send(reactivated);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// DELETE /api/admin/users/:userId
// Lets admin mark a specific user as inactive
adminRouter.delete('/users/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            const deletedUser = createInactiveUser(userId);
            res.send(deletedUser);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// --- Admin functionality for orders ---

// GET /api/admin/orders/:userId
// Lets admin view a specific user's orders
adminRouter.get('/orders/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user.id) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            const orders = await getOrdersByUser();
            res.send(orders);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/admin/orders/:orderId
// Lets admin view a specific order
adminRouter.get('/orders/:orderId', async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await getOrderById(orderId);

        if (!order.id) {
            res.status(404);
            next({
                error: '404',
                name: 'OrderNotFoundError',
                message: 'Order not found'
            })
        } else {
            res.send(order);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/admin/orders
// Lets admin view all orders
adminRouter.get('/orders', async (req, res, next) => {
    try {
        const orders = await getAllOrders();
        res.send(orders);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/orders/status/:orderId
// Lets admin update a specific order's status
adminRouter.patch('/orders/status/:orderId', async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await getOrderById(orderId);

        if (!order.id) {
            res.status(404);
            next({
                error: '404',
                name: 'OrderNotFoundError',
                message: 'Order not found'
            })
        } else {
            const updatedOrder = await updateStatus({ id: orderId, status })
            res.send(updatedOrder);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// --- Admin functionality for puppies ---

// GET /api/admin/puppies
// Shows all puppies (including unavailable ones)
adminRouter.get('/puppies', async (req, res, next) => {
    try {
        const puppies = await getAllPupppies();
        res.send(puppies);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/admin/puppies/categories
// Lets admin add a category for puppy sorting
adminRouter.post('/puppies/categories', async (req, res, next) => {
    try {
        const { name } = req.body;

        if (typeof name !== "string") {
            res.status(400)
            next({
                error: '400',
                name: 'InvalidNameError',
                message: 'That is not a valid category name'
            })
        } else {
            const category = createCategory(name);
    
            // only reason to not get a category.id back at this point is because it already exists and there should be a UNIQUE conflict
            if (!category.id) {
                res.status(400);
                next({
                    error: '400',
                    name: 'DuplicateCategoryError',
                    message: 'There is already a category with that name'
                })
            }
            
            res.send(category);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// POST /api/admin/puppies/tagged_puppies
// Lets admin add a specific puppy to a specific category
adminRouter.post('/puppies/tagged_puppies', async (req, res, next) => {
    try {
        const { categoryId, puppyId } = req.body;
        const category = await getCategoryById(categoryId)
        
        if (!category.id) {
            res.status(404);
            next({
                error: '404',
                name: 'CategoryNotFoundError',
                message: 'Category not found'
            })
        }

        const puppy = await getPuppyById(puppyId);

        if (!puppy.id) {
            res.status(404);
            next({
                error: '404',
                name: 'PuppyNotFoundError',
                message: 'Puppy not found'
            })
        }

        const taggedPuppy = addPuppyToCategory(categoryId, puppyId);
        res.send(taggedPuppy)
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// POST /api/admin/puppies
// Lets admin create a puppy entry
adminRouter.post('/puppies', async (req, res, next) => {
    try {
        const {
            name,
            description,
            image1,
            image2,
            age,
            breed,
            weight,
            size,
            pedigree,
            isVaccinated,
            isAltered,
            gender,
            isAvailable,
            price
        } = req.body;
        const puppy = createPuppy({
            name,
            description,
            image1,
            image2,
            age,
            breed,
            weight,
            size,
            pedigree,
            isVaccinated,
            isAltered,
            gender,
            isAvailable,
            price
        });

        if (!puppy.id) {
            res.status(400);
            next({
                error: '400',
                name: 'PuppyCreationError',
                message: 'Unable to create puppy'
            })
        }
        
        res.send(puppy);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// PATCH /api/admin/puppies/:puppyId
// Lets admin update a specific puppy's info
adminRouter.patch('/puppies/:puppyId', async (req, res, next) => {
    try {
        const { puppyId } = req.params;
        const { ...fields } = req.body;

        const puppy = await getPuppyById(puppyId);

        if (!puppy.id) {
            res.status(404);
            next({
                error: '404',
                name: 'PuppyNotFoundError',
                message: 'Puppy not found'
            })
        } else {
            const updatedPuppy = await updatePuppy({ puppyId, ...fields });

            if (!updatedPuppy.id) {
                res.status(400);
                next({
                    error: '400',
                    name: 'PuppyUpdateError',
                    message: 'Unable to update puppy info'
                })
            } else {
                res.send(updatedPuppy);
            }
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// DELETE /api/admin/puppies/categories/:categoryId
adminRouter.delete('puppies/categories/:categoryId', async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const deletedCategory = await deleteCategory(categoryId);
        res.send(deletedCategory)

    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// DELETE /api/admin/puppies/tagged_puppies/:puppyId/:categoryId
// Lets admin remove a puppy from a category
adminRouter.delete('puppies/tagged_puppies/:puppyId/:categoryId', async (req, res, next) => {
    try {
        const { puppyId, categoryId } = req.params;

        const deletedPuppy = await deletePuppyFromCategory(puppyId, categoryId);
        res.send(deletedPuppy)

    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// DELETE /api/admin/puppies/:puppyId
// Lets admin mark a puppy as unavailable (which should remove it from storefront)
adminRouter.delete('puppies/:puppyId', async (req, res, next) => {
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
        } else {
            const deletedPuppy = await deletePuppy(puppyId);
            res.send(deletedPuppy)
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = adminRouter;