const { User } = require("../../domain");
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const createAccountValidation = {
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string(),
    username: Joi.string().required(),
    password: Joi.string().required()
  })
}

async function createAccount(req, res) {

  const { firstname, lastname, username, password } = req.body; 
  const createdUser = await User.createAccount({
    username,
    password,
    firstname,
    lastname,
  });

  res.json(createdUser);

}

module.exports = [validate(createAccountValidation), createAccount];