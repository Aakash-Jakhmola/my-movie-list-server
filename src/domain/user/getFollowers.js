const { Follow } = require('../../database/models');

function formatFollowers(data) {
  return {
    username: data.followers.username,
    watchedMoviesCount: data.followers.watchedMoviesCount,
    watchLaterMoviesCount: data.followers.watchLaterMoviesCount,
    followersCount: data.followers.followersCount,
    followingCount: data.followers.followingCount,
    firstname: data.followers.firstname,
  };
}

async function getFollowers({ username, viewer }) {
  const followers = await Follow.aggregate([
    { $match: { following: username } },
    {
      $project: {
        _id: 0,
        following: 0,
        __v: 0,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'follower',
        foreignField: 'username',
        as: 'followers',
      },
    },
    { $unwind: '$followers' },
  ]);
  return followers.map((f) => formatFollowers(f));
}

module.exports = getFollowers;
