const express = require('express');
const { getUserDetails} = require('../controllers/userDetails');
const userAuth = require('../middlewares/userAuth');

const userRouter = express.Router();

// Route to get all users
userRouter.get('/data', userAuth, getUserDetails);

// // Route to get a user by ID
// userRouter.get('/:id', getUserById);

// // Route to create a new user
// userRouter.post('/', createUser);

// // Route to update a user by ID
// userRouter.put('/:id', updateUser);

// // Route to delete a user by ID
// userRouter.delete('/:id', deleteUser);

module.exports = userRouter;