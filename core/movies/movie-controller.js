const axios = require('axios');
const urlfunc = require('./../urlfunctions');
const { Movie } = require('./../../models/movie')


const makeMovieObject = async(movieData) => {
  const movieObj = new Movie( {
    title: movieData.original_title,
    overview: movieData.overview,
    release_date: movieData.release_date,
    runtime: movieData.runtime,
    genres: movieData.genres ? movieData.genres.map( g => g.name ) : [],
    vote_average: movieData.vote_average,
    adult: movieData.adult,
    language: movieData.original_language,
    poster_url: movieData.poster_path,
    movie_id: movieData.id,
  });
  let saved = false;
  key = {"movie_id": movieObj.movie_id};
  try {
    await Movie.updateMany(key, movieObj, {"upsert":true})
      .then( () => {
        saved = true;
      })
      .catch((e)=>{
        saved = false;
      })
  } catch(err) {
    saved = false;
  }

  return saved ? movieObj : null;
}

const fetchMovie = async(movieId) => {
  
  const result = axios.get(urlfunc.GetMovieUrl(movieId))
              .then( ( resp ) => 
                makeMovieObject(resp.data)
                              .then((res)=> res )               
              )
              .catch( (err) => console.log(err))
  return result ;
}

module.exports = {
  fetchMovie
}