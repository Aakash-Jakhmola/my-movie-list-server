const Tmdb = require('./../../utils/tmdb');
const tmdb = new Tmdb();

async function getTrending(username) {
  const trenadingMovies = await tmdb.getTrending();
  console.log(trenadingMovies);
  return trenadingMovies;
}

module.exports = getTrending;
