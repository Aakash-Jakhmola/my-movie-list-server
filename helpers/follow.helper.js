const { Follow } = require("../models/Follow.model");



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


const followUser = async(followObj) => {
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


const unfollowUser = async(followObj) => {
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
  followersCount,
  followingCount,
  followUser,
  unfollowUser,
}