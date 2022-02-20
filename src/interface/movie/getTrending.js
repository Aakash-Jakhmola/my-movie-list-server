const { Movie } = require('../../domain');

async function getTrending(req, res) {
  const { username } = req;
  const trendingMovies = await Movie.getTrending(username);
  res.json(trendingMovies);
}

module.exports = [getTrending];
