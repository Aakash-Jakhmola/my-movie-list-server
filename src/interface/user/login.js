const { User } = require("../../domain");
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const loginValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
}

async function login(req, res) {
  const { username, password } = req.body; 
  console.log({username, password});
  const { user, token} = await User.login({ username, password});
  res.cookie('jwt', token );
  res.json(user);

}

module.exports = [validate(loginValidation), login];