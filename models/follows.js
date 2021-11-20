const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: String,
    ref: 'User',
    required: true,
  },
  following: {
    type: String,
    ref: 'User' ,
    required: true,
  }
});

followSchema.index({follower: 1, following: 1}, {unique: true})

const Follow = mongoose.model('Follow', followSchema);


module.exports = {
  Follow
}