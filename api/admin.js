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
    deleteCategory,
    getAllPuppies,
    updateShippingAddress,
    updateBillingAddress
} = require('../db');
const { checkAdmin } = require("./utils");

// Checks if the user is an admin before running any of the below routes
// alternative to putting checkAdmin in each route
// adminRouter.use('/', checkAdmin)

// --- Admin functionality for users ---

// GET /api/admin/users/inactive
adminRouter.get('/users/inactive', checkAdmin, async (req, res, next) => {
    try {
        const inactiveUsers = await getAllInactiveUsers();

        res.send(inactiveUsers);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/admin/users/:userId
// Lets admin view specific user
adminRouter.get('/users/:userId', checkAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user) {
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

// GET /api/admin/users
// Lets admin view all users
adminRouter.get('/users', checkAdmin, async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.send(users);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/users/promote/:userId
// Lets admin promote a specific user to admin status
adminRouter.patch('/users/promote/:userId', checkAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            // need a function that adds a row to admins table using the userId parameter to fill in the "userId" column
            const newAdmin = await createAdmin({ userId });
            res.send(newAdmin);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/users/reset/:userId
// Lets admin set a specific user to require a password reset
adminRouter.patch('/users/reset/:userId', checkAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            // need a function that adds a row to reset_users table using the userId parameter to fill in the "userId" column
            const targetUser = await createResetUser(userId);
            res.send(targetUser);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/users/:userId
// Lets admin edit a specific user's info
adminRouter.patch('/users/:userId', checkAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const userInfo = { ...req.body };

        delete userInfo.shippingAddress;
        delete userInfo.billingAddress;

        const user = await getUserById(userId);

        if (!user) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        }

        if (req.body.email) {
            const userByEmail = await getUserByEmail(req.body.email);

            if (userByEmail && userByEmail.id !== userId) {
                res.status(403);
                next({
                    error: '403',
                    name: 'EmailInUseError',
                    message: 'That email is already in use'
                })
            } else {
                if (req.body.shippingAddress) {
                    await updateShippingAddress(userId, req.body.shippingAddress);
                }
                if (req.body.billingAddress) {
                    await updateBillingAddress(userId, req.body.billingAddress);
                }
                const updatedUser = await updateUser({ id: userId, ...userInfo });
    
                if (!updatedUser) {
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
            if (req.body.shippingAddress) {
                await updateShippingAddress(userId, req.body.shippingAddress);
            }
            if (req.body.billingAddress) {
                await updateBillingAddress(userId, req.body.billingAddress);
            }
            const updatedUser = await updateUser({ id: userId, ...userInfo });

            if (!updatedUser) {
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

// POST /api/admin/users/reactivate/:userId
// Lets admin reactivate an inactive user
adminRouter.post('/users/reactivate/:userId', checkAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            const reactivatedUser = await deleteInactiveUser(userId);
            res.send(reactivatedUser);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// DELETE /api/admin/users/:userId
// Lets admin mark a specific user as inactive
adminRouter.delete('/users/:userId', checkAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            const deletedUser = await createInactiveUser({ userId });
            res.send(deletedUser);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// --- Admin functionality for orders ---

// GET /api/admin/orders/users/:userId
// Lets admin view a specific user's orders
adminRouter.get('/orders/users/:userId', checkAdmin, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);

        if (!user) {
            res.status(404);
            next({
                error: '404',
                name: 'UserNotFoundError',
                message: 'User not found'
            })
        } else {
            const orders = await getOrdersByUser({ id: userId });
            res.send(orders);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/admin/orders/:orderId
// Lets admin view a specific order
adminRouter.get('/orders/:orderId', checkAdmin, async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await getOrderById(orderId);

        if (!order) {
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
adminRouter.get('/orders', checkAdmin, async (req, res, next) => {
    try {
        const orders = await getAllOrders();
        res.send(orders);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/orders/status/:orderId
// Lets admin update a specific order's status
adminRouter.patch('/orders/status/:orderId', checkAdmin, async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await getOrderById(orderId);

        if (!order) {
            res.status(404);
            next({
                error: '404',
                name: 'OrderNotFoundError',
                message: 'Order not found'
            })
        } else {
            const updatedOrder = await updateStatus({ id: orderId, status });
            res.send(updatedOrder);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// --- Admin functionality for puppies ---

// GET /api/admin/puppies
// Shows all puppies (including unavailable ones)
adminRouter.get('/puppies', checkAdmin, async (req, res, next) => {
    try {
        const puppies = await getAllPuppies();
        res.send(puppies);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/admin/puppies/categories
// Lets admin add a category for puppy sorting
adminRouter.post('/puppies/categories', checkAdmin, async (req, res, next) => {
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
            const category = await createCategory(name);
    
            // only reason to not get a category.id back at this point is because it already exists and there should be a UNIQUE conflict
            if (!category) {
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
adminRouter.post('/puppies/tagged_puppies', checkAdmin, async (req, res, next) => {
    try {
        const { categoryId, puppyId } = req.body;
        const category = await getCategoryById(categoryId)
        
        if (!category) {
            res.status(404);
            next({
                error: '404',
                name: 'CategoryNotFoundError',
                message: 'Category not found'
            })
        }

        const puppy = await getPuppyById(puppyId);

        if (!puppy) {
            res.status(404);
            next({
                error: '404',
                name: 'PuppyNotFoundError',
                message: 'Puppy not found'
            })
        }

        const taggedPuppy = await addPuppyToCategory({ categoryId, puppyId });
        res.send(taggedPuppy)
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// POST /api/admin/puppies
// Lets admin create a puppy entry
adminRouter.post('/puppies', checkAdmin, async (req, res, next) => {
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
        const puppy = await createPuppy({
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

        if (!puppy) {
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
adminRouter.patch('/puppies/:puppyId', checkAdmin, async (req, res, next) => {
    try {
        const { puppyId } = req.params;
        const { ...fields } = req.body;

        const puppy = await getPuppyById(puppyId);

        if (!puppy) {
            res.status(404);
            next({
                error: '404',
                name: 'PuppyNotFoundError',
                message: 'Puppy not found'
            })
        } else {
            const updatedPuppy = await updatePuppy({ id: puppyId, ...fields });

            if (!updatedPuppy) {
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
// Lets admin delete a category
adminRouter.delete('/puppies/categories/:categoryId', checkAdmin, async (req, res, next) => {
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
adminRouter.delete('/puppies/tagged_puppies/:puppyId/:categoryId', checkAdmin, async (req, res, next) => {
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
adminRouter.delete('/puppies/:puppyId', checkAdmin, async (req, res, next) => {
    try {
        const { puppyId } = req.params;
        const puppy = await getPuppyById(puppyId);

        if (!puppy) {
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