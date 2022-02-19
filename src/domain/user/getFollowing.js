const { Follow } = require("../../database/models");



async function getFollowing({username, viewer}) {

  const following = await Follow.aggregate([
    { $match : { follower : username}},
    { $project: {
      _id: 0,
      username: 0,
      __v: 0,
    }},
    { $lookup :  {
                  from : 'users',
                  localField: 'following',
                  foreignField: 'username',
                  as: 'following'
                }
    },
    { $unwind : '$following'}
  ]);

  return following;
}

module.exports = getFollowing;