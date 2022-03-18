const { Follow } = require('../../database/models');

function formatFollowing(data) {
  return {
    username: data.following.username,
    watchedMoviesCount: data.following.watchedMoviesCount,
    watchLaterMoviesCount: data.following.watchLaterMoviesCount,
    followersCount: data.following.followersCount,
    followingCount: data.following.followingCount,
    firstname: data.following.firstname,
  };
}

async function getFollowing({ username, viewer }) {
  const following = await Follow.aggregate([
    { $match: { follower: username } },
    {
      $project: {
        _id: 0,
        username: 0,
        __v: 0,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'following',
        foreignField: 'username',
        as: 'following',
      },
    },
    { $unwind: '$following' },
  ]);

  return following.map((f) => formatFollowing(f));
}

module.exports = getFollowing;
