const { Movie } = require('../../database/models');
const ErrorHandler = require('../../utils/errorHandler');
const Tmdb = require('./../../utils/tmdb');

const tmdb = new Tmdb();

async function addMovie(movieId) {
  const movie = tmdb.getMovie(movieId);
  if(!movie) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Could not find any such movie',
    });
  }
  await Movie.updateOne({ movieId: movie.movieId }, movie, {
    upsert: true,
  });
  return movie;
}

module.exports = addMovie;
