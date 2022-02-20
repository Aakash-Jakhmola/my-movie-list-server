const { Movie } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const getMovieListValidation = {
  query: Joi.object({
    username: Joi.string().required(),
    hasWatched: Joi.boolean().required(),
    offset: Joi.number(),
    limit: Joi.number(),
    sortBy: Joi.string().optional().valid('time', 'score'),
  }),
};

async function getMovieList(req, res) {
  const { username, hasWatched, offset, limit, sortBy } = req.query;
  const result = await Movie.getMovieList({
    username,
    hasWatched: hasWatched === 'true',
    offset,
    limit,
    sortBy,
    viewer: req.username,
  });
  res.json(result);
}

module.exports = [validate(getMovieListValidation), getMovieList];
