const { Movie } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const getMoviesByNameValidation = {
  query: Joi.object({
    search: Joi.string().required().min(4),
  }),
};

async function getMoviesByName(req, res) {
  const { username } = req;
  const { search } = req.query;
  const movies = await Movie.getMoviesByName(search, username);
  res.json(movies);
}

module.exports = [validate(getMoviesByNameValidation), getMoviesByName];
