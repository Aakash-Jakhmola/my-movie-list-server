const { Movie } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const removeMovieValidation = {
  params: Joi.object({
    movieId: Joi.number().required(),
  }),
  query: Joi.object({
    hasWatched: Joi.boolean().required(),
  }),
};

async function removeMovie(req, res) {
  const { username } = req;
  const { movieId } = req.params;
  const { hasWatched } = req.query;
  const result = await Movie.removeMovie({ username, movieId, hasWatched });
  res.json(result);
}

module.exports = [validate(removeMovieValidation), removeMovie];
