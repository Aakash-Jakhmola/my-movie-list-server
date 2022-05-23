const { Follow } = require('../../database/models');

function formatFollowers(data) {
  return {
    username: data.followers.username,
    watchedMoviesCount: data.followers.watchedMoviesCount,
    watchLaterMoviesCount: data.followers.watchLaterMoviesCount,
    followersCount: data.followers.followersCount,
    followingCount: data.followers.followingCount,
    firstname: data.followers.firstname,
    isViewerFollowing: data.isViewerFollowing,
    isViewerFollowed: data.isViewerFollowed,
  };
}

async function isFollowing(follower, following) {
  if (!follower || !following) return false;
  const data = await Follow.findOne({ follower, following });
  if (data) return true;
  else return false;
}

async function getFollowers({ username, viewer }) {
  console.log({ viewer });
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
  return await Promise.all(
    followers.map(async (f) =>
      formatFollowers({
        ...f,
        isViewerFollowing: await isFollowing(viewer, f.followers.username),
        isViewerFollowed: await isFollowing(f.followers.username, viewer),
      }),
    ),
  );
}

module.exports = getFollowers;
