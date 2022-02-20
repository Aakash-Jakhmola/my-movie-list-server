const mongoose = require('mongoose');

const _watch = {};

_watch.schema = new mongoose.Schema({
  username: {
    type: String,
    ref: 'User'
  },

  movieId: {
    type: Number,
    ref: 'Movie'
  },

  score: { 
    type: Number,
    required: true,
  },
  
  review: {
    type: String,
    required: true,
  },
  
  hasWatched: {
    type: Boolean,
    required: true,
  }
  
});

_watch.schema.index({username: 1, movieId: 1}, {unique: true, required: true})

_watch.model = mongoose.model('Watch', _watch.schema);


module.exports = _watch;