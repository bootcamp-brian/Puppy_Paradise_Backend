/* eslint-disable no-useless-catch */
const express = require("express");
const adminRouter = express.Router();
const {
    getAllUsers,
    getAllOrders,
    getUserById,
    getUserByEmail,
    updateUser,
    addAdmin,
    resetUser,
    createInactiveUser,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    getAllPupppies,
    createPuppy,
    updatePuppy,
    deletePuppy,
    getAllCategories,
    getAllTaggedPuppies,
    getCategoryById,
    getPuppyById,
    tagPuppy,
    createCategory,
} = require('../db');
const { checkAdmin } = require("./utils");

// Checks if the user is an admin before running any of the below routes
// alternative to putting checkAdmin in each route
adminRouter.use('/', checkAdmin)

// --- Admin functionality for users ---

// GET /api/admin/users/:userId
// Let's admin view specific user
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

// GET /api/admin/users
// Let's admin view all users
adminRouter.get('/users', async (req, res, next) => {
    try {
        const users = await getAllUsers();
        const inactiveUsers = await getAllInactiveUsers();


        res.send(users);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/users/:userId
// Let's admin edit a specific user's info
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
// Let's admin promote a specific user to admin status
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
            const newAdmin = addAdmin(userId);
            res.send(newAdmin);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/users/reset/:userId
// Let's admin set a specific user to require a password reset
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
            const targetUser = resetUser(userId);
            res.send(targetUser);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// DELETE /api/admin/users/:userId
// Let's admin mark a specific user as inactive
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
// Let's admin view a specific user's orders
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

// Think this route might not be needed
// GET /api/admin/orders/:orderId
// Let's admin view a specific order
// adminRouter.get('/orders/:orderId', async (req, res, next) => {
//     try {
//         const { orderId } = req.params;
//         const order = await getOrderById(orderId);

//         if (!order.id) {
//             res.status(404);
//             next({
//                 error: '404',
//                 name: 'OrderNotFoundError',
//                 message: 'Order not found'
//             })
//         } else {
//             res.send(order);
//         }
//     } catch ({ error, name, message }) {
//         next({ error, name, message });
//     } 
// })

// GET /api/admin/orders
// Let's admin view all orders
adminRouter.get('/orders', async (req, res, next) => {
    try {
        const orders = await getAllOrders();
        res.send(orders);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// PATCH /api/admin/orders/status/:orderId
// Let's admin update a specific order's status
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

// GET /api/admin/puppies/categories
// Shows all puppy categories but also checks if user is admin
// may not need this, depends on how we setup frontend
// puppiesRouter.get('/puppies/categories', async (req, res, next) => {
//     try {
//         const categories = await getAllCategories();
//         res.send(categories);
//     } catch ({ error, name, message }) {
//         next({ error, name, message });
//     } 
// })

// GET /api/admin/puppies/tagged_puppies
// Shows all tagged puppies but also checks if user is admin
// may not need this, depends on how we setup frontend
// puppiesRouter.get('/puppies/tagged_puppies', async (req, res, next) => {
//     try {
//         const taggedPuppies = await getAllTaggedPuppies();
//         res.send(taggedPuppies);
//     } catch ({ error, name, message }) {
//         next({ error, name, message });
//     } 
// })

// GET /api/admin/puppies/:puppyId
// Shows specific puppy but also checks if user is admin
// may not need this, depends on how we setup frontend
// adminRouter.get('puppies/:puppyId', async (req, res, next) => {
//     try {
//         const { puppyId } = req.params;
//         const puppy = await getPuppyById(puppyId);

//         if (!puppy.id) {
//             res.status(404);
//             next({
//                 error: '404',
//                 name: 'PuppyNotFoundError',
//                 message: 'Puppy not found'
//             })
//         }
        
//         res.send(puppy);
//     } catch ({ error, name, message }) {
//         next({ error, name, message });
//     } 
// })

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
// Let's admin add a category for puppy sorting
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

// POST /api/admin/puppies/tagged_puppies/:categoryId/:puppyId
// Let's admin add a specific puppy to a specific category
adminRouter.post('/puppies/tagged_puppies/:categoryId/:puppyId', async (req, res, next) => {
    try {
        const { categoryId, puppyId } = req.params;
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

        const taggedPuppy = tagPuppy(categoryId, puppyId);
        res.send(taggedPuppy)
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
})

// POST /api/admin/puppies
// Let's admin create a puppy entry
adminRouter.post('/puppies', async (req, res, next) => {
    try {
        const {
            name,
            description,
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
// Let's admin update a specific puppy's info
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

// DELETE /api/admin/puppies/:puppyId
// Let's admin mark a puppy as unavailable (which should remove it from storefront)
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