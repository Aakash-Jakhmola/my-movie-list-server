const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  movie_id: {
    type: Number,
    unique: true,
    required: true,
  },
  overview: String,
  release_date: String,
  runtime: Number,
  genres: [ String ],
  vote_average: Number,
  adult : Boolean,
  language: String,
  poster_url: String,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
  Movie
}