const { User, Watch } = require('../../database/models');
const ErrorHandler = require('../../utils/errorHandler');
const inViewerList = require('./inViewerList');

async function getMovieList({
  username,
  hasWatched = false,
  offset,
  sortBy = '_id',
  limit,
  viewer,
}) {
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Could not find user with username ${username}`,
    });
  }

  if (sortBy === 'time') {
    sortBy = '_id';
  }

  const query = { username, hasWatched };
  const sortObj = {};
  sortObj[sortBy] = -1;

  const movieList = await Watch.aggregate([
    { $match: query },
    { $sort: sortObj },
    { $skip: offset },
    { $limit: limit },
    {
      $project: { _id: 0, userId: 0 },
    },
    {
      $lookup: {
        from: 'movies',
        localField: 'movieId',
        foreignField: 'movieId',
        as: 'movieDetails',
      },
    },
    { $unwind: '$movieDetails' },
  ]);

  let result = movieList.map((movie) => ({
    ...movie.movieDetails,
    score: movie.score,
    review: movie.review,
  }));

  if (viewer) result = inViewerList(result, viewer);

  return result;
}

module.exports = getMovieList;
