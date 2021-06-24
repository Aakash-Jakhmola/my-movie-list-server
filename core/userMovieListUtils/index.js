const addMovieToMovieList = require('./addMovie')
const updateMovieDetailsInMovieList = require('./updateMovie')
const getMovieList = require('./getMovieList')
const deleteMovieFromMovieList = require('./deleteMovie')

let MovieUtils = {
  getMovieList : getMovieList,
  addMovieToList : addMovieToMovieList,
  updateMovieInList : updateMovieDetailsInMovieList,
  deleteMovieFromList : deleteMovieFromMovieList
}

module.exports = MovieUtils