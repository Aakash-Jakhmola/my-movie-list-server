const { User, Watch } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");

async function getMovieListByAccount({ username, watchLater = false , pageNumber = 1, sortKey = '_id'}) {
  const foundUser = await User.findOne({username});
  if(!foundUser) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Could not find user with username ${username}`,
    });
  }
 
    
    
    const query = {
      username,
      watch_later: watchLater,
    }
    
    const result = await Watch.aggregate([
      { $match: query },
      { $sort: sortKey },
      { $skip: (pageNumber - 1) * constants.PAGE_SIZE },
      { $limit: constants.PAGE_SIZE },
      {
        $project: {
          "_id": 0,
          "user_id": 0
        }
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie_id',
          foreignField: 'movie_id',
          as: 'movie_details'
        }
      },
      {
        $unwind: '$movie_details'
      },
    ]);

}

module.exports = getMovieListByAccount;