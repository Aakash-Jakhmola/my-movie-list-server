const { User } = require('../../models/user.js')

const getUserDetailsFromDb = async (username) => {
  try {
    let foundUser = await User.findOne({ username: username })
    if (!foundUser)
      return { error: "invalid username" }
    return { result: foundUser }
  } catch (err) {
    return { error: err }
  }
}


module.exports = getUserDetailsFromDb
