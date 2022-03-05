const { Watch } = require("../../database/models");

async function inViewerList(movieList, viewer) {
  const movieIds = movieList.map((m) => m.movieId);
  const data = await Watch.aggregate([
    {
      $match: {
        $and: [{ username: viewer }, { movieId: { $in: movieIds } }],
      },
    },
    { $project: { movieId: 1, hasWatched: 1, _id: 0 } },
  ]);

  let viewerWatched = {},
    inHasWatched = {};

  data.forEach((obj) => {
    viewerWatched[obj.movieId] = true;
    inHasWatched[obj.movieId] = obj.hasWatched;
  });

  movieList.forEach((movie, index) => {
    movieList[index]["inViewerList"] = viewerWatched[movie.movieId]
      ? true
      : false;
    if (movieList[index]["inViewerList"]) {
      movieList[index]["hasWatched"] = inHasWatched[movie.movieId];
    }
  });

  return movieList;
}

module.exports = inViewerList;