const { Follow } = require("../../database/models");

async function getFollowers({ username, viewer } ) {
  const followers = await Follow.aggregate([
    { $match : {following : username}},
    { $project: {
      _id: 0,
      following: 0,
      __v: 0,
    }},
    { $lookup :  {
                  from : 'users',
                  localField: 'follower',
                  foreignField: 'username',
                  as: 'followers_details'
                }
    },
    { $unwind : '$followers_details'}
  ]);
  return followers;
}

module.exports = getFollowers;