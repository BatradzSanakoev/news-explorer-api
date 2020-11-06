/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password.toString(), 10)
    // eslint-disable-next-line arrow-body-style
    .then((hash) => {
      return User.create({ email, password: hash, name });
    })
    .catch((err) => {
      if (err.message === 'user validation failed') {
        throw new ConflictError('Пользователь с таким электронным ящиком уже зарегистрирован или неправильно введен пароль!');
      } else next(err);
    })
    .then((newUser) => {
      if (!newUser) {
        throw new BadRequestError('Переданы некорректные данные!');
      }
      res.send(newUser);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Авторизация завершилась неудачно!');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true
      })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};