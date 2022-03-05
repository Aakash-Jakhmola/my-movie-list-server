const { default: axios } = require("axios");
const config = require("./../../config");

const GenreMap = new Map([
  [28, "Action"],
  [12, "Adventure"],
  [16, "Animation"],
  [35, "Comedy"],
  [80, "Crime"],
  [99, "Documentary"],
  [18, "Drama"],
  [10751, "Family"],
  [14, "Fantasy"],
  [36, "History"],
  [27, "Horror"],
  [10402, "Music"],
  [9648, "Mystery"],
  [10749, "Romance"],
  [878, "Science Fiction"],
  [10770, "TV Movie"],
  [53, "Thriller"],
  [10752, "War"],
  [37, "Western"],
]);

class Tmdb {
  constructor() {
    this.baseUrl = "https://api.themoviedb.org/3";
  }

  getGenresFromIds(genreIds) {
    if (genreIds) return genreIds.map((genre_id) => GenreMap.get(genre_id));
    else return [];
  }

  formatMovie(movie) {
    return {
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres
        ? movie.genres.map((g) => g.name)
        : this.getGenresFromIds(movie.genre_ids),
      adult: movie.adult,
      language: movie.original_language,
      posterUrl:
        movie.poster_path &&
        `https://image.tmdb.org/t/p/w400/${movie.poster_path}`,
      movieId: movie.id,
    };
  }

  async getMovie(movieId) {
    const { data } = await axios.get(
      `${this.baseUrl}/movie/${movieId}?api_key=${config.API_KEY}`
    );
    return this.formatMovie(data);
  }

  async getTrending() {
    const { data } = await axios.get(
      `${this.baseUrl}/trending/movie/day?api_key=${config.API_KEY}`
    );
    return data.results.map((movie) => this.formatMovie(movie));
  }

  async searchMovie(name) {
    const { data } = await axios.get(
      `${this.baseUrl}/search/movie?api_key=${config.API_KEY}&query=${name}`
    );
    return data.results.map((movie) => this.formatMovie(movie));
  }
}

module.exports = Tmdb;
