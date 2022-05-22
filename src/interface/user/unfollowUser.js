const { User } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const unfollowUserValidation = {
  query: Joi.object({
    following: Joi.string().required(),
  }),
};

async function unfollowUser(req, res) {
  const { following } = req.query;
  const { username } = req;

  await User.unfollowUser({
    username,
    followingUsername: following,
  });
  res.json({ message: 'hello' });
}

module.exports = [validate(unfollowUserValidation), unfollowUser];
