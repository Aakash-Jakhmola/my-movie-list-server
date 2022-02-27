const { Watch } = require("../../database/models");

async function hasViewerWatched(movieList, viewer) {
  const movieIds = movieList.map((m) => m.movieId);
  console.log(movieIds);
  const data = await Watch.aggregate([
    {
      $match: {
        $and: [{ username: viewer }, { movieId: { $in: movieIds } }],
      },
    },
    { $project: { movieId: 1, _id: 0 } },
  ]);
 
  let viewerWatched = {};
  data.forEach((obj) => {
    viewerWatched[obj.movieId] = true;
  });

  movieList.forEach((movie, index) => {
    movieList[index]["viewerHasWatched"] = viewerWatched[movie.movieId]
      ? true
      : false;
  });

  return movieList;
}

module.exports = hasViewerWatched;
