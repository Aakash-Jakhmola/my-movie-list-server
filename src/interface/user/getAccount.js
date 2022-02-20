const { User } = require("../../domain");
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const getAccountValidation = {
  query: Joi.object({
    username: Joi.string().optional(),
    search: Joi.string().optional(),
  }).xor('username', 'search'),
}

async function getAccount(req, res) {
  const viewer = req.username;
  const {username, search } = req.query;
  console.log({username, viewer});
  const users = await User.getAccount({username, search, viewer})
  res.json(users);
}

module.exports = [validate(getAccountValidation), getAccount];