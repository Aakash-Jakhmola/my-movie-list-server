const { User } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const getFollowingValidation = {
  params: Joi.object({
    username: Joi.string().required(),
  }),
};

async function getFollowing(req, res) {
  const { username } = req.params;
  const viewer = req.username;

  const following = await User.getFollowing({ username, viewer });

  res.json(following);
}

module.exports = [validate(getFollowingValidation), getFollowing];
