require('../');

const _models = {
  User: require('./schema/user').model,
  Movie: require('./schema/movie').model,
  Watch: require('./schema/watch').model,
  Follow: require('./schema/follow').model,
}

module.exports = _models;