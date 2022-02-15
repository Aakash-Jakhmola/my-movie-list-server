const { User } = require('../../models/User.model')

const deleteMovieFromMovieList = async (username, movieid) => {

  if(!username) {
    return {error : "username missing"}
  }

  if(!movieid) {
    return {error : "movieid missing"}
  }

  try {
    await User.findOneAndUpdate({ username: username }, {
      $pull: { movies: { movieid: { $eq: movieid } }, movies_by_rating: { movieid: { $eq: movieid } } }
    },
      { safe: true, upsert: true }
    )
    console.log('here')
    return {msg : "Successfully deleted"}
  } catch (err) {
    return { error: err.message }
  }
}

module.exports = deleteMovieFromMovieList