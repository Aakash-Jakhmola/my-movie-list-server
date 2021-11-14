const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  movie_id: {
    type: Number,
    ref: 'Movie'
  },
  score: Number,
  review: String,
  watch_later: Boolean,
});

watchSchema.index({user_id: 1, movie_id: 1}, {unique: true});

const Watch = mongoose.model('Watch', watchSchema);

module.exports = {
  Watch
}