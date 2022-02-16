const { User, Watch } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");

async function getMovieListByAccount({ username, hasWatched = false , pageNumber = 1, sortKey = '_id', pageSize = 20}) {
  
  const foundUser = await User.findOne({username});
  
  if(!foundUser) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Could not find user with username ${username}`,
    });
  }
 
  const query = {  username, hasWatched };
  const sortObj = {};
  sortObj[sortKey] = -1;
    
  const movieList = await Watch.aggregate([
    { $match: query },
    { $sort: sortObj },
    { $skip: (pageNumber - 1) * pageSize },
    { $limit: pageSize },
    {
      $project: { "_id": 0, "userId": 0 }
    },
    {
      $lookup: {
        from: 'movies',
        localField: 'movieId',
        foreignField: 'movieId',
        as: 'movieDetails'
      }
    },
    { $unwind: '$movieDetails' },
  ]);

  return movieList;
}

module.exports = getMovieListByAccount;