const bcrypt = require('bcryptjs')
const  getUserDetailsFromDb  = require('./getUserDetails')

//  callback hell
const CheckCredentialsAndGetUser = async (username, password) => {
  if(!username) {
    return {error : "missing username"}
  }
  if(!password) {
    return {error : "missing password"}
  }
  let result = await getUserDetailsFromDb(username)
  if(result.error)
    return result
  if(!await bcrypt.compare(password, result.result.password))
    return {error : "Wrong password"}
  return result
}

module.exports = CheckCredentialsAndGetUser 