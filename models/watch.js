const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
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

watchSchema.index({username: 1, movie_id: 1}, {unique: true, required: true})

const Watch = mongoose.model('Watch', watchSchema);


module.exports = {
  Watch
}