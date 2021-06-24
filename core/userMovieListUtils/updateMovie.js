const { User } = require('../../models/user.js')


const updateMovieDetailsInMovieList = async(username, movieid, rating , review) => {


  if(!username) {
    return {error : "username missing"}
  }

  if(!movieid) {
    return {error : "movieid missing"}
  }

  if(!rating) {
    return {error : "rating missing"}
  }

  if(!review) {
    return {error : "review missing"}
  }


  try {
    await User.updateOne(
      { "username": username, "movies.movieid": movieid, "movies_by_rating.movieid": movieid },
      { $set: { "movies.$.rating": rating, "movies.$.review": review, "movies_by_rating.$.rating": rating, "movies_by_rating.$.review": review } },
      { upsert: true }
    )
    return {msg : "Updated Succesfully"}
  } catch (err) {
    return { error: err }
  }
}

module.exports = updateMovieDetailsInMovieList