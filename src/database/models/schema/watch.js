const mongoose = require('mongoose');

const _watch = {};

_watch.schema = new mongoose.Schema({
  username: {
    type: String,
    ref: 'User'
  },

  movie_id: {
    type: Number,
    ref: 'Movie'
  },

  score: Number,
  
  review: String,
  
  watch_later: {
    type: Boolean,
    required: true,
  }
  
});

_watch.schema.index({username: 1, movie_id: 1}, {unique: true, required: true})

_watch.model = mongoose.model('Watch', _watch.schema);


module.exports = _watch;