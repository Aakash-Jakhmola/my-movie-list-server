const { User } = require('../../models/user')
const mongoose = require('mongoose')


// Optimisation required

const addMovieToMovieList = async (userid, movieid, rating, review) => {

  if(!userid) {
    return {error : "Userid missing"}
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

  movieid = parseInt(movieid)
  rating = parseInt(rating)

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