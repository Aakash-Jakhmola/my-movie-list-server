const config = require('./../../config');

class Tmdb {
  constructor() {
    this.baseUrl = "https://api.themoviedb.org/3/movie";
  }

  formatMovie(movie) {
    return {
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres ? movie.genres.map( g => g.name ) : [],
      adult: movie.adult,
      language: movie.original_language,
      posterUrl: movie.poster_path?"https://image.tmdb.org/t/p/w400"+movie.poster_path:'',
      movieId: movie.id,
    }; 
  }
  
  
  
  async getMovie(movieId) {
    
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${config.API_KEY}`
    );
    return this.formatMovie(data);
   
  }

}

module.exports = Tmdb;