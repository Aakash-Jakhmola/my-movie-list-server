const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  username: {
    type: String,
    ref: 'User',
    required: true,
  },

  following_username: {
    type: String,
    ref: 'User' ,
    required: true,
  }
  
});

followSchema.index({username: 1, following_username: 1}, {unique: true})

const Follow = mongoose.model('Follow', followSchema);


module.exports = {
  Follow
}