const { Watch } = require('../../database/models');
const ErrorHandler = require('../../utils/errorHandler');

async function editMovie({ username, movieId, score, review }) {
  const movie = await Watch.findOne({ username, movieId });
  if (!movie) {
    throw ErrorHandler.throwError({
      code: 404,
      message: 'could not find such movie',
    });
  }
  if (score) movie.score = score;
  if (review) movie.review = review;

  await movie.save();
  return movie;
}

module.exports = editMovie;
