const { User, Follow } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");
const mongoose = require('mongoose');

async function followUser({username, followingUsername}) {

  if(username === followingUsername) {
    return ErrorHandler.throwError({
      code: 403,
      message: 'Cannot follow self',
    });
  }

  const followingUser = await User.findOne({ username : followingUsername });

  if(!followingUser) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Could not find such user',
    });
  }

  const followObj = {
    follower: username, 
    following: followingUsername,
  };

  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };
  
  const transactionResults = await session.withTransaction( async() => {
    await Follow.insertMany( [followObj] , {session});
    await User.findOneAndUpdate({ username: followObj.following }, { $inc : {'followersCount': 1} }, {session} );
    await User.findOneAndUpdate({ username: followObj.follower }, { $inc : {'followingCount': 1} }, {session} );
  }, transactionOptions);

  if (transactionResults) {
    console.log("Added Follower");
  } else {
    return ErrorHandler.throwError({
      code: 500,
    });
  }
  session.endSession();
}

module.exports = followUser;