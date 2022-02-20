const mongoose = require('mongoose');
const ErrorHandler = require('../../utils/errorHandler');
const addMovie = require('./addMovie');

async function addMovieInList({ username, movieId, hasWatched,  }) {
  const movie = await addMovie(movieId);
  if (!movie) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Could not find such movie',
    });
  }

  const watchObj = { hasWatched };
  let listCnt = 'watchedMoviesCount';

  if(hasWatched) {
    watchObj.score = score;
    watchObj.review = review;
    listCnt = 'watchLaterMoviesCount';
  }


  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  const transactionResults = await session.withTransaction(async () => {
    await Watch.updateMany({ username, movieId }, watchObj, {
      upsert: true,
      safe: true,
    });
    await User.findOneAndUpdate({ username }, { $inc: listCnt }, { session });
  }, transactionOptions);

  if (transactionResults) {
    console.log('Added movie successfully');
  } else {
    console.log('Adding Movie transaction was intentionally aborted.');
    return ErrorHandler.throwError({
      code: 500,
    });
  }
  session.endSession();
}

module.exports = addMovieInList;
