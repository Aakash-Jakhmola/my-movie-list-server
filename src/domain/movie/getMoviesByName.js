const Tmdb = require('./../../utils/tmdb');
const tmdb = new Tmdb();

async function getMoviesByName(search, username) {
  const movies = await tmdb.searchMovie(search);
  // console.log(movies);
  return movies;
}

module.exports = getMoviesByName;