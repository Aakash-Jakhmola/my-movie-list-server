const { User } = require('../../models/User.model.js')
const bcrypt = require('bcryptjs')

const IfUserAlreadyExists =  async (username) => {
  try {
    let foundUser = await User.findOne({username : username})
    if(foundUser)
      return {result :true}
    return {result : false}
  } catch(err) {
    return {error : err}
  }
}



const SaveUser = async (username, password, firstname,lastname) => {
  
  let res = await IfUserAlreadyExists(username)

  if(res.error)
    return {error : res.error}
  if(res.result)
    return {error : "user already exists"}
  const newUser = new User( {
    username : username , 
    password : password,
    firstname : firstname,
    lastname : lastname
  })
  return HashPasswordAndStoreUserInDb(newUser)
} 

module.exports = SaveUser 

