const mongoose = require('mongoose');

const _movie = {};

_movie.schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  movieId: {
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
  
  posterUrl : String,
  
});

_movie.model = mongoose.model('Movie', _movie.schema);

module.exports = _movie;