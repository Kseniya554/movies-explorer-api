const routes = require('express').Router();
const express = require('express');
const auth = require('../middlewares/auth');
const usersRouter = require('./user');
const movieRouter = require('./movie');

const NotFoundError = require('../errors/NotFoundError');

const { createUser, login } = require('../controllers/user');
const { validationUserSignup, validationUserSignin } = require('../utils/validation');

routes.post('/signup', express.json(), validationUserSignup, createUser);
routes.post('/signin', express.json(), validationUserSignin, login);

routes.use('/users', auth, usersRouter);
routes.use('/movies', auth, movieRouter);

routes.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый URL не существует'));
});

module.exports = routes;
