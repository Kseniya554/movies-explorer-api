const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError ');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find()
    .populate(['owner'])
    .sort({ createdAt: -1 })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user,
  })
    .then((movie) => {
      movie.populate(['owner'])
        .then((moviePopulate) => res.status(201).send(moviePopulate));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // console.log(err);
        next(new BadRequestError('Неверно заполнены поля'));
        return;
      }
      next(err);
      // console.log(JSON.stringify(e));
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((movie) => {
      // if (!movie) {
      //   throw new NotFoundError('Такой карточки нет');
      // }
      if (`${movie.owner}` !== req.user._id) {
        throw new ForbiddenError('Нет доступа на удаление карточки');
      }
      return movie.deleteOne()
        .then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovies, deleteMovie, createMovie,
};
