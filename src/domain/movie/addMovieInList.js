const mongoose = require('mongoose');
const { Watch, User } = require('../../database/models');
const ErrorHandler = require('../../utils/errorHandler');
const addMovie = require('./addMovie');

async function addMovieInList({
  username,
  movieId,
  hasWatched,
  score,
  review,
}) {
  const movie = await addMovie(movieId);
  if (!movie) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Could not find such movie',
    });
  }

  const addedMovie = await Watch.findOne({ movieId, username });
  if (addedMovie) {
    return ErrorHandler.throwError({
      code: 403,
      message: `Already added to the list ${
        addedMovie.hasWatched ? 'Watched' : 'Watch Later'
      }`,
    });
  }

  const watchObj = { hasWatched };
  let listCnt = {};

  if (hasWatched) {
    watchObj.score = score;
    watchObj.review = review;
    listCnt['watchedMoviesCount'] = 1;
  } else {
    listCnt['watchLaterMoviesCount'] = 1;
  }

  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  const transactionResults = await session.withTransaction(async () => {
    await Watch.updateOne({ username, movieId }, watchObj, { upsert: true });
    await User.findOneAndUpdate({ username }, { $inc: listCnt }, { session });
    return 'MEsssagre';
  }, transactionOptions);

  if (transactionResults) {
    console.log('Added movie successfully');
    return { message: 'Added Movie Successfully' };
  } else {
    console.log('Adding Movie transaction was intentionally aborted.');
    return ErrorHandler.throwError({
      code: 500,
    });
  }
  session.endSession();
}

module.exports = addMovieInList;
