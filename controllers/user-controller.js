const { User } = require('../models/user');
const {Follow} = require('../models/follows');
const { Watch } = require('../models/watch');



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

const moviesCount = async(username, watchLater = false) => {
  let noOfMovies = 0 ;
  try {
    const result = await Watch.aggregate([ 
      { $match: {username: username, watch_later: watchLater}},
      { $count: "movies_count"}
    ]) ;
    if(result.length > 0) {
      noOfMovies = result[0].movies_count;
    }
  } catch(e) {
    throw new Error('counting failed');
  }
  return noOfMovies;
};

const followersCount = async(username) => {
  
  let noOfFollowers = 0;
  try {
    const result = await Follow.aggregate([
      { $match : {following_username : username}},
      { $count : "followers_count"}
    ]);
    console.log(result);
    if(result.length > 0) {
      noOfFollowers = result[0].followers_count;
    }
  } catch(e) {
    throw new Error('Counting Followers Failed');
  }
  return noOfFollowers;
};
 
const followingCount = async(username) => {
  
  let noOfFollowing = 0;
  try {
    const result = await Follow.aggregate([
      { $match : {username : username}},
      { $count : "following_count"}
    ]);
    console.log(result);
    if(result.length > 0) {
      noOfFollowing = result[0].following_count;
    }
  } catch(e) {
    throw new Error('Counting Following Failed');
  }
  return noOfFollowing;
};

module.exports = {
  updateMovieCount,
  getFollowers,
  getFollowing,
  moviesCount,
  followersCount,
  followingCount,
}