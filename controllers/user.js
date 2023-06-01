// const users  = require('../models/user');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generateToken } = require('../utils/token');
const BadRequestError = require('../errors/BadRequestError ');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError ');

const SOLT_ROUNDS = 10;

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({
      name, email, password: hash,
    });
    if (newUser) {
      res.status(201).send({
        name: newUser.name,
        _id: newUser._id,
        email: newUser.email,
      });
      return;
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Невалидный email или password'));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: generateToken({ _id: user._id }),
      });
    })
    .catch(next);
};

module.exports = {
  createUser, updateUser, login, getUserMe,
};
