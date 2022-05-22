const { Follow } = require('../../database/models');

function formatFollowing(data) {
  return {
    username: data.following.username,
    watchedMoviesCount: data.following.watchedMoviesCount,
    watchLaterMoviesCount: data.following.watchLaterMoviesCount,
    followersCount: data.following.followersCount,
    followingCount: data.following.followingCount,
    firstname: data.following.firstname,
    isViewerFollowing: data.isViewerFollowing,
    isViewerFollowed: data.isViewerFollowed,
  };
}

async function isFollowing(follower, following) {
  if (!follower || !following) return false;
  console.log({ follower, following });
  const data = await Follow.findOne({ follower, following });
  if (data) return true;
  else return false;
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

  return await Promise.all(
    following.map(async (f) =>
      formatFollowing({
        ...f,
        isViewerFollowing: await isFollowing(viewer, f.following.username),
        isViewerFollowed: await isFollowing(f.following.username, viewer),
      }),
    ),
  );
}

module.exports = getFollowing;
