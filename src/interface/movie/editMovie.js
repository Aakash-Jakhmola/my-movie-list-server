const { Movie } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const editMovieValidation = {
  params: Joi.object({
    movieId: Joi.number().required(),
  }),
  body: Joi.object({
    score: Joi.number().min(1).max(10),
    review: Joi.string().min(3).max(200),
  }),
};

async function editMovie(req, res) {
  const { username } = req;
  const { movieId } = req.params;
  const { score, review } = req.body;
  const result = await Movie.editMovie({ username, movieId, score, review });
  res.json(result);
}

module.exports = [validate(editMovieValidation), editMovie];
