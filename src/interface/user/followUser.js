const { User } = require("../../domain");
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const followUserValidation = {
  body: Joi.object({
    following: Joi.string().required(),
  })
};


async function followUser(req, res) {
  const { following } = req.body;
  const { username } = req;

  await User.followUser({
    username,
    followingUsername: following,
  });
  res.json({message: "hello"});
}

module.exports = [validate(followUserValidation), followUser];