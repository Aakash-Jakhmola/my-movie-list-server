const { User, Follow } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");


async function getAccount({ username, search, viewer }) {

  let users = [];

  if(username) {
    const foundUser = await User.findOne({username});
    if(!foundUser) {
      return ErrorHandler.throwError({
        code: 404,
        message: `could not find user with username: ${username}`,
      })
    }
    users = [ foundUser ];
  } else {
    users = await User.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } }
      ]
    });
  }
  
  console.log({viewer});
  const userNameToIdxMap = {};
  const usernames = [];

  users = users.map( (user, index)  => {
    userNameToIdxMap[user.username] = index;
    usernames.push(user.username);
    return user.safeObject();
  });

  

  // get the users which the viewer is following or is being followed
  const viewerFollowing = await Follow.aggregate([
    {
      $match: {
        $or: [
          {
            $and: [
              { follower: viewer },
              { following: { $in: usernames } }
            ]
          },
          {
            $and: [
              { follower: { $in: usernames }},
              { following : viewer},
            ]
          }
        ]
      }, 
    }, 
  ]);

  viewerFollowing.map((f) => {
    const followerIdx = userNameToIdxMap[f.follower];
    const followingIdx = userNameToIdxMap[f.following];
   
    if(f.follower === viewer) {
      users[followingIdx].isFollowing = true;
    } 
    if(f.following === viewer) {
      users[followerIdx].isFollowed = true;
    }
  })

  return users;
  
}

module.exports = getAccount;