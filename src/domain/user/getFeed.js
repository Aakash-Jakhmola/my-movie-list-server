async function getFeed({ user, offset, limit }) {
 
  const followersData = await getFollowing(user.username);
  const followers = followersData.map((val) =>
    followers.push(val.following_details.username)
  );

  const result = await Watch.aggregate([
    { $match: { username: { $in: followers } } },
    { $sort: { _id: -1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        user_id: 0,
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
