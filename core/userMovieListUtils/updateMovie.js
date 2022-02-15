const { User } = require('../../models/User.model.js')


const updateMovieDetailsInMovieList = async (username, movieid, rating, review) => {


  if (username === undefined) {
    return { error: "username missing" }
  }

  if (movieid === undefined) {
    return { error: "movieid missing" }
  }

  if (rating === undefined) {
    return { error: "rating missing" }
  }

  if(rating < 1 || rating > 10) {
    return {error : "rating should be in range 1 to 10."}
  }

  if (review === undefined || review === null) {
    return { error: "review missing" }
  }

  
  try {
    await User.updateOne(

      {
        "username": username, "movies.movieid": movieid
      },
      { $set: { "movies.$.rating": rating, "movies.$.review": review } },
     
    )
    await User.updateOne(

      {
        "username": username, "movies_by_rating.movieid": movieid
      },
      { $set: { "movies_by_rating.$.rating": rating, "movies_by_rating.$.review": review } },
     
    )
    return { msg: "Updated Succesfully" }
  } catch (err) {
    console.log(err)
    return { error: err }
  }
}

module.exports = updateMovieDetailsInMovieList