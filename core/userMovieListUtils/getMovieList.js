const { User } = require('../../models/user')
const getMovieListAndSort = require('./getMovieListAndSort')


const getMovieList = async (username, orderby, offset) => {
  try {
    let result = {};
    if (orderby == 'rating') {
      result = await User.findOne({ username: username }, {
        "id": 1,
        "movies_by_rating": { $slice: [offset, offset + 10] }
      })
    } else {
      result = await User.findOne({ username: username }, {
        "id": 1,
        "movies": { $slice: [offset, offset + 10] }
      })
    }
    if(!result) {
      return {error : "user not found"}
    }

    let re = await getMovieListAndSort(result,orderby)
    if(re.error)
      return {error : re.error}

    return {result : re.result}
    
  } catch (err) {
    return { error: err }
  }
}

module.exports = getMovieList