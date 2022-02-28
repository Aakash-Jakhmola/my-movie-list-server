const Tmdb = require('./../../utils/tmdb');
const hasViewerWatched = require('./inViewerList');
const tmdb = new Tmdb();

async function getTrending(viewer) {
  const trendingMovies = await tmdb.getTrending();
  console.log(trendingMovies);
  return hasViewerWatched(trendingMovies,viewer);
}

module.exports = getTrending;
