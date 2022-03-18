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
  const offset = req.query.offset;
  const limit = req.query.limit;
  const feed = await User.getFeed({ username, offset, limit });
  res.json(feed);
}

module.exports = [validate(getFeedValidation), getFeed];
