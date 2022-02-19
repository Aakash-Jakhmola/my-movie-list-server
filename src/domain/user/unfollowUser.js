const { User, Follow } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");
const mongoose = require('mongoose');

async function unfollowUser({username, followingUsername}) {

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
    const doc = await Follow.findOneAndDelete( followObj , {session});
    if(doc) {
      await User.findOneAndUpdate({ username: followObj.following }, { $inc : {'followersCount': -1} }, {session} );
      await User.findOneAndUpdate({ username: followObj.follower }, { $inc : {'followingCount': -1} }, {session} );
    } else {
      return ErrorHandler.throwError({
        code: 404,
        message: 'Could not find following',
      })
    }
  }, transactionOptions);

  if (transactionResults) {
    console.log("Following Removed");
  } else {
    return ErrorHandler.throwError({
      code: 500,
    });
  }
 
  session.endSession();
}

module.exports = unfollowUser;