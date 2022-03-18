const { User } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const getFollowerValidation = {
  params: Joi.object({
    username: Joi.string().required(),
  }),
};

async function getFollower(req, res) {
  const { username } = req.params;
  const following = await User.getFollowers({ username, viewer: req.username });
  res.json(following);
}

module.exports = [validate(getFollowerValidation), getFollower];
