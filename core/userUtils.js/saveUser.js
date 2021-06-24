const { User } = require('../../models/user.js')
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

const HashPasswordAndStoreUserInDb = async(newUser) => {
  try {
    let salt = await bcrypt.genSalt(12) ;
    newUser.password = await bcrypt.hash(newUser.password, salt)
    await newUser.save()
    return {msg : "successfull"}
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

