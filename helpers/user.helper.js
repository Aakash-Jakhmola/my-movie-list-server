const { followingCount, followersCount } = require("./follow.helper");
const { moviesCount } = require("./watch.helper");


const userObject = user => {  
  try {
    return {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      movies_count: user.movies_count,
      watch_later_count: user.watch_later_count,
      followers_count: user.followers_count,
      following_count: user.following_count,
    };
  } catch(e) {
    throw new Error('Making User Object Failed');
  }
}


module.exports = {
  userObject,
}