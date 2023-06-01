const express = require('express');

const userRouter = express.Router();
const { updateUser, getUserMe } = require('../controllers/user');
const { validationUpdateUser } = require('../utils/validation');

userRouter.get('/me', getUserMe);

userRouter.patch('/me', express.json(), validationUpdateUser, updateUser);

module.exports = userRouter;
