const express = require('express');

const movieRouter = express.Router();

const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movie');

const { validationCreateMovie, validationMovieId } = require('../utils/validation');

movieRouter.get('/', getMovies);

movieRouter.delete('/:movieId', validationMovieId, deleteMovie);

movieRouter.post('/', express.json(), validationCreateMovie, createMovie);

module.exports = movieRouter;
