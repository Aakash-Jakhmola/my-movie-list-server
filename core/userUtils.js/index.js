const CheckCredentialsAndGetUser = require('./checkCredentials')
const getUserDetailsFromDb = require('./getUserDetails')
const SaveUser = require('./saveUser')

let res = {
  CheckCredentialsAndGetUser : CheckCredentialsAndGetUser,
  getUserDetailsFromDb : getUserDetailsFromDb,
  SaveUser : SaveUser
}

module.exports = res 