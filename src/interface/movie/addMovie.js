const { Movie } = require('../../domain');
const { validator } = require('./../middlewares');
const { Joi, validate } = validator;

const addMovieValidation = {
  body: Joi.object({
    movieId: Joi.number().required(),
    hasWatched: Joi.boolean().required(),
    score: Joi.number().when('hasWatched', {
      is: Joi.equal(true),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    review: Joi.string().when('hasWatched', {
      is: Joi.equal(true),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }),
};

async function addMovie(req, res) {
  const { username } = req;
  const { movieId, hasWatched, score, review } = req.body;
  console.log({ movieId, hasWatched, score, review });
  // return;
  const addedMovie = await Movie.addMovieInList({
    username,
    movieId,
    hasWatched,
    score,
    review,
  });

  res.json(addedMovie);
}

module.exports = [validate(addMovieValidation), addMovie];
