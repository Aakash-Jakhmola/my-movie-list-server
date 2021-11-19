const { User } = require('./../models/user');
const {Follow} = require('./../models/follows');

const updateMovieCount = async(username, list) => {
  const query = {};
  list.map((item) => {
    query[item.type] = item.amount;
  })
  await User.findOneAndUpdate( {username : username}, 
    { $inc : query }
  )
};

const getFollowers = async(username) => {
  console.log('here');
  let followers = null;
  try {
    followers = await Follow.aggregate([
      { $match : {following_username : username}},
      { $project: {
        _id: 0,
        following_username: 0,
        __v: 0,
      }},
      { $lookup :  {
                    from : 'users',
                    localField: 'username',
                    foreignField: 'username',
                    as: 'followers_details'
                  }
      },
      { $unwind : '$followers_details'}
    ]);
    console.log(followers);
  } catch(e) {
    console.log(e);
  }
  return followers;
};

const getFollowing = async(username) => {
  let following = null;
  try {
    following = await Follow.aggregate([
      { $match : {username : username}},
      { $project: {
        _id: 0,
        username: 0,
        __v: 0,
      }},
      { $lookup :  {
                    from : 'users',
                    localField: 'following_username',
                    foreignField: 'username',
                    as: 'following_details'
                  }
      },
      { $unwind : '$following_details'}
    ]);
  } catch(e) {
    console.log(e);
  }
  return following;
};

module.exports = {
  updateMovieCount,
  getFollowers,
  getFollowing,

}