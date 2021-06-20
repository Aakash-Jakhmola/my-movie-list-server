const postfunc = require('../core/postfunctions')

var sortMovies = function (movielist, orderby) {
  if (orderby == 'rating') {
      movielist.sort((a, b) => {
          if (a.rating > b.rating) {
              return -1;
          } else if (a.rating < b.rating) {
              return 1;
          }
          return 0;
      })
      return;
  }

  movielist.sort((a, b) => {
      if (a.time > b.time) {
          return -1;
      } else if (a.time < b.time) {
          return 1;
      }
      return 0;
  })
}

async function getMovieList(err, doc, orderby) {
  return new Promise((resolve, reject) => {
      let movielist = [];
      if (err)
          reject(err)
      else {
          console.log(doc)
          let result = doc.movies
          if (orderby == 'rating') {
              result = doc.movies_by_rating
          }
          console.log(result)
          result.forEach(element => {
              postfunc.RenderMovie(element.movieid)
                  .then(movie => {
                      movielist.push({
                          time: element._id.getTimestamp(),
                          movieid: element.movieid,
                          rating: element.rating,
                          review: element.review,
                          movie: movie
                      });
                      if (movielist.length == result.length) {
                          sortMovies(movielist, orderby);
                          resolve(movielist)
                      }

                  })
                  .catch(err => {
                      movielist.push({
                          time: element._id.getTimestamp(),
                          movieid: element.movieid,
                          rating: element.rating,
                          review: element.review,
                          error: err.error
                      })
                      if (movielist.length == result.length) {
                          sortMovies(movielist, orderby);
                          resolve(movielist)
                      }

                  });
          });

      }
  })
}

module.exports = getMovieList