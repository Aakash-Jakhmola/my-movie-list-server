const Tmdb = require("./../../utils/tmdb");
const inViewerList = require("./inViewerList");
const tmdb = new Tmdb();

async function getMoviesByName(search, username) {
  const movies = await tmdb.searchMovie(search);

  return inViewerList(movies, username);
}

module.exports = getMoviesByName;
