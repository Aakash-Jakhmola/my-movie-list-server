const { User } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const getFeedValidation = {
  query: Joi.object({
    offset: Joi.number(),
    limit: Joi.number(),
  }),
};

async function getFeed(req, res) {
  const username = req.username;
  const offset = parseInt(req.query.offset, 10);
  const limit = parseInt(req.query.limit, 10);
  const feed = await User.getFeed({ username, offset, limit });
  res.json(feed);
}

module.exports = [validate(getFeedValidation), getFeed];
