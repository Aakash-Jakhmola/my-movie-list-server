const getFollowing = require('./getFollowing');
const { Watch } = require('../../database/models');

async function getFeed({ username, offset = 0, limit = 10 }) {
  let following = await getFollowing({ username });
  following = following.map((f) => f.username);

  const result = await Watch.aggregate([
    { $match: { username: { $in: following } } },
    { $sort: { _id: -1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        user_id: 0,
        __v: 0,
      },
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
  
  return result;
}

module.exports = getFeed;
