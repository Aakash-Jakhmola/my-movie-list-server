const mongoose = require('mongoose');

const _movie = {};

_movie.schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  movieId: {
    type: Number,
    unique: true,
    required: true,
  },

  overview: String,

  releaseDate: String,

  runtime: Number,

  genres: [String],

  voteAverage: Number,

  adult: Boolean,

  language: String,

  posterUrl: String,
});

_movie.schema.methods.safeObject = function () {
  const safeFields = [
    'title',
    'movieId',
    'overview',
    'realeaseDate',
    'runtime',
    'voteAverage',
    'adult',
    'language',
    'posterUrl',
  ];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_movie.model = mongoose.model('Movie', _movie.schema);

module.exports = _movie;
