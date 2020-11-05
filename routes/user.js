const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser } = require('../controllers/user');

userRouter.get('/users/me', getUser);

module.exports = userRouter;