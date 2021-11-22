const { User } = require('../models/user');
const {Follow} = require('../models/follows');
const { Watch } = require('../models/watch');
const mongoose = require('mongoose');


const updateMovieCount = async(username, list) => {
  const query = {};
  list.map((item) => {
    query[item.type] = item.amount;
  })
  await User.findOneAndUpdate( {username : username}, 
    { $inc : query }
  )
};
/* follower follows following */
const getFollowers = async(username) => {
  console.log('here');
  let followers = null;
  try {
    followers = await Follow.aggregate([
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
    console.log(followers);
  } catch(e) {
    console.log(e);
  }
  

  return followers;
};


const getFollowing = async(username) => {
  let following = null;
  console.log(username);
  try {
    following = await Follow.aggregate([
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
      { $match : {following : username}},
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
      { $match : {follower : username}},
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


const addMovieToUserList = async(user, query, watchObj, list) => {

  const session = await mongoose.startSession();
  
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };
  
  try {
    const transactionResults = await session.withTransaction(async () => {
      await Watch.updateMany(query, watchObj, {upsert: true, safe: true});
      await User.findOneAndUpdate({username: user.username}, { $inc : list }, {session} );
    }, transactionOptions);

    if (transactionResults) {
      console.log("The transaction was successfully created.");
    } else {
      console.log("The transaction was intentionally aborted.");
      throw new Error('Could not add due to internal error');
    }
  } catch(e) {
    throw new Error('Could not add due to internal error');
  }
  session.endSession();
};


const removeMovieFromUserList = async(query) => {
  const session = await mongoose.startSession();
  
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };

  let list = {};
  if(query.watch_later) {
    list['watch_later_count'] = -1;
  } else {
    list['movies_count'] = -1;
  }
  try {
    const transactionResults = await session.withTransaction(async () => {
      const doc = await Watch.findOneAndDelete(query, {session});
      if(!doc) {
        throw new Error('not found');
      }
      const res = await User.findOneAndUpdate({username: query.username}, { $inc : list }, {session} );
      if(!res) {
        throw new Error('not found');
      }
    }, transactionOptions);

    if (transactionResults) {
      console.log("The transaction was successfully created.");
    } else {
      console.log("The transaction was intentionally aborted.");
      throw new Error('Could not remove due to internal error');
    }
  } catch(e) {
    console.log(e);
    throw new Error('Could not remove due to internal error');
  }
  session.endSession();
};


const addFollower = async(followObj) => {
  const session = await mongoose.startSession();
  
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };
  
  try {
    const transactionResults = await session.withTransaction( async() => {
      await Follow.insertMany( [followObj] , {session});
      await User.findOneAndUpdate({ username: followObj.following }, { $inc : {'followers_count': 1} }, {session} );
      await User.findOneAndUpdate({ username: followObj.follower }, { $inc : {'following_count': 1} }, {session} );
    }, transactionOptions);

    if (transactionResults) {
      console.log("The transaction was successfully created.");
    } else {
      console.log("The transaction was intentionally aborted.");
      throw new Error('Could not add due to internal error');
    }
  } catch(e) {
    console.log(e);
    throw new Error('Could not add due to internal error');
  }
  session.endSession();
};


const removeFollower = async(followObj) => {
  const session = await mongoose.startSession();
  
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };
  
  try {
    const transactionResults = await session.withTransaction( async() => {
      const doc = await Follow.findOneAndDelete( followObj , {session});
      console.error(doc);
      if(doc) {
        await User.findOneAndUpdate({ username: followObj.following }, { $inc : {'followers_count': -1} }, {session} );
        await User.findOneAndUpdate({ username: followObj.follower }, { $inc : {'following_count': -1} }, {session} );
      } else {
        throw new Error('could not remove following');
      }
    }, transactionOptions);

    if (transactionResults) {
      console.log("The transaction was successfully created.");
    } else {
      console.log("The transaction was intentionally aborted.");
      throw new Error('could not remove following');
    }
  } catch(e) {
    throw new Error('Could not remove due to internal error');
  }
  session.endSession();
};


module.exports = {
  updateMovieCount,
  getFollowers,
  getFollowing,
  moviesCount,
  followersCount,
  followingCount,
  addMovieToUserList,
  removeMovieFromUserList,
  addFollower,
  removeFollower,
}