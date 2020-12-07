/* eslint-disable no-unused-vars */
const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, signOut } = require('../controllers/user');

userRouter.get('/users/me', getUser);
userRouter.get('/signout', signOut);

module.exports = userRouter;