const axios = require('axios');
const urlfunc = require('./../urlfunctions');
const { Movie } = require('./../../models/movie')


const makeMovieObject = async(movieData) => {
  const movieObj = new Movie( {
    title: movieData.title,
    overview: movieData.overview,
    release_date: movieData.release_date,
    runtime: movieData.runtime,
    genres: movieData.genres ? movieData.genres.map( g => g.name ) : [],
    vote_average: movieData.vote_average,
    adult: movieData.adult,
    language: movieData.original_language,
    poster_url: movieData.poster_path?"https://image.tmdb.org/t/p/w400"+movieData.poster_path:'',
    movie_id: movieData.id,
  });

  key = {"movie_id": movieObj.movie_id};
  try {
    await Movie.updateOne(key, movieObj, {"upsert":true})
    return true;
  } catch(err) {
    return false;
  }

  
}

const saveMovie = async(movieId) => {
  let result = false;
  try {
    const movieDetails = await axios.get(urlfunc.GetMovieUrl(movieId));
    result = await makeMovieObject(movieDetails.data);
    return true;
  } catch(err) {
    console.log(err);
  } 
  return result ;
}

module.exports = {
  saveMovie: saveMovie
}