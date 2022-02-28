const Tmdb = require('./../../utils/tmdb');
const inViewerList = require('./inViewerList');
const tmdb = new Tmdb();

async function getTrending(viewer) {
  const trendingMovies = await tmdb.getTrending();
  console.log(trendingMovies);
  return inViewerList(trendingMovies,viewer);
}

module.exports = getTrending;
