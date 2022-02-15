const mongoose = require('mongoose');

const _movie = {};

_movie.schema = new mongoose.Schema({
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

_movie.model = mongoose.model('Movie', _movie.schema);

module.exports = _movie;