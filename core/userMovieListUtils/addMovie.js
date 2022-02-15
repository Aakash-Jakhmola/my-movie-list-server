const { User } = require('../../models/User.model')
const mongoose = require('mongoose')


// Optimisation required

const addMovieToMovieList = async (userid, movieid, rating, review) => {

  if (userid === undefined) {
    return { error: "userid missing" }
  }

  if (movieid === undefined) {
    return { error: "movieid missing" }
  }


  if (review === undefined || review === null) {
    return { error: "review missing" }
  }

  movieid = parseInt(movieid)
  rating = parseInt(rating)

  if (rating === undefined) {
    return { error: "rating missing" }
  }

  if(rating < 1 || rating > 10) {
    return {error : "rating should be in range 1 to 10."}
  }
  
  const movieDetails = { movieid: movieid, rating: rating, review: review }

  try {
    let userExists = await User.countDocuments({ _id: userid })
    if (userExists == 0) {
      throw new Error("User does not exists")
    }

    //check if movie is already added 
    let currentMovieList = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(userid) } },
      { $project: { movies: 1 } }
    ])

    for (let i = 0; i < currentMovieList[0].movies.length; i++) {
      if (currentMovieList[0].movies[i].movieid == movieid) {
        throw new Error("Movie already watched")
      }
    }

    await User.findByIdAndUpdate(userid,
      {
        $push: {
          movies: {
            $each: [movieDetails], $position: 0
          },
          movies_by_rating: {
            $each: [movieDetails],
            $sort: { rating: -1 }
          }
        }
      },
      { safe: true, upsert: true })
    return {msg : "Added successfully!"}
  } catch (err) {
    return {error : err.message}
  }
}

module.exports = addMovieToMovieList