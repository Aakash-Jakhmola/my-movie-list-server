const { moviesCount, followersCount, followingCount } = require('../../controllers/user-controller');
const CheckCredentialsAndGetUser = require('./checkCredentials')
const getUserDetailsFromDb = require('./getUserDetails')
const SaveUser = require('./saveUser')

const makeUser = async(userData) => {
  if(userData === null || userData === undefined) 
    return null;
  const user = {
    username: userData.username,
    firstname: userData.firstname,
    lastname: userData.lastname,
    movies_count: userData.movies_count,
    watch_later_count: userData.watch_later_count,
    followers_count: await followersCount(userData.username),
    following_count: await followingCount(userData.username),
  };
  return user;
}

let res = {
  CheckCredentialsAndGetUser,
  getUserDetailsFromDb,
  SaveUser,
  makeUser,
}

module.exports = res 