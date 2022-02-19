const mongoose = require('mongoose');
const { Schema } = mongoose;

const _follow = {};

_follow.schema = new Schema(
  {
    follower: {
      type: String,
      ref: 'User',
      required: true,
    },
    following: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_follow.schema.index({ follower: 1, following: 1 }, { unique: true });

_follow.model = mongoose.model('follow', _follow.schema);

module.exports = _follow;
