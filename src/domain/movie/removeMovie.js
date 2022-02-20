const { User, Watch } = require('../../database/models');
const ErrorHandler = require('../../utils/errorHandler');
const mongoose = require('mongoose');

async function removeMovie({ username, movieId, hasWatched }) {
  const movie = await Watch.findOne({ username, movieId, hasWatched });
  if (!movie) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Could not find such movie',
    });
  }

  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  let list = {};
  if (hasWatched) {
    list['watchedMoviesCount'] = -1;
  } else {
    list['watchLaterMoviesCount'] = -1;
  }

  const transactionResults = await session.withTransaction(async () => {
    await Watch.findOneAndDelete(
      { username, hasWatched, movieId },
      { session }
    );
    await User.findOneAndUpdate(
      { username: username },
      { $inc: list },
      { session }
    );
  }, transactionOptions);

  if (transactionResults) {
    console.log('Deleted movied successfully.');
  } else {
    console.log('Deletion was intentionally aborted.');
    return ErrorHandler.throwError({
      code: 500,
    });
  }

  session.endSession();
  return { message: 'Movie deleted successfully' };
}

module.exports = removeMovie;
