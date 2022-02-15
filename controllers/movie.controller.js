const axios = require('axios');
const urlfunc = require('../core/urlfunctions');
const { Movie } = require('../models/Movie.model')


const movieObject = (movieData) => {
  return {
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
  }; 
}



const saveMovie = async(movieId) => {
  try {
    const movieDetails = await axios.get("https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+process.env.API_KEY);
    const movieObj = movieObject(movieDetails.data);
    console.log(movieObj);
    await Movie.updateOne({"movie_id": movieObj.movie_id}, movieObj, {upsert:true});
  } catch(err) {
    console.log(err);
    throw new Error('Error occured during saving Movie');
  } 
}


const MovieController = {
  saveMovie,
  movieObject,
}


module.exports = MovieController;