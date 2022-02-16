const { User } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");

async function getAccount({ username, search, viewer }) {
  if(username) {
    const foundUser = await User.findOne({username});
    if(!foundUser) {
      return ErrorHandler.throwError({
        code: 404,
        message: `could not find user with username: ${username}`,
      })
    }
    return foundUser;
  } 

  const users = await User.find({
    $or: [
      { username: { $regex: search, $options: "i" } },
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } }
    ]
  });
  let result = [];
  let usernameToFollowMap = {};
  let usernames = users.map((u) => u.username);

  const followingData = await Follow.aggregate([
    {
      $match: {
        $and: [
          { follower: viewer },
          { following: { $in: usernames } }
        ]
      }
    },
  ]);
  followingData.map((r) => {
    usernameToFollowMap[r.following] = true;
  })

  docs.map((user) => {
    result.push({
      user_details: user,
      is_following: usernameToFollowMap[user.username] != null
    });
  })
  
  return result;
  
}

module.exports = getAccount;