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
  const { offset, limit } = req.query;
  const feed = await User.getFeed({
    username,
    offset: parseInt(offset, 10) || 0,
    limit: parseInt(limit, 10) || 10,
  });
  res.json(feed);
}

module.exports = [validate(getFeedValidation), getFeed];
