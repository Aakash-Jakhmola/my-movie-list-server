const { User } = require('../../models/user.js')

const getUserDetailsFromDb = async (username) => {
  try {
    let foundUser = await User.findOne({ username: username },
      {
        username: 1,
        firstname: 1,
        lastname: 1,
        password: 1,
        movies_count: { $size: '$movies' },
        followers_count: { $size: '$followers' },
        following_count: { $size: '$following' },
      })

    if (!foundUser)
      return { error: "invalid username" }
    return { result: foundUser }
  } catch (err) {
    return { error: err }
  }

}


module.exports = getUserDetailsFromDb
