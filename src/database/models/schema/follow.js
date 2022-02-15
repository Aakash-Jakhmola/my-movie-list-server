const mongoose = require('mongoose');

const _follow = {};

_follow.schema = new mongoose.Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
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
