const express = require('express');
const router = express.Router();
const {
  asyncHandler,
  asyncHandlerArray,
} = require('./../../utils/asyncHandler');

const addMovie = require('./addMovie');
const getMoviesByName = require('./getMoviesByName');
const getTrending = require('./getTrending');
const removeMovie = require('./removeMovie');

router.get('/', asyncHandlerArray(getMoviesByName));
router.get('/trending', asyncHandlerArray(getTrending));
router.post('/add', asyncHandlerArray(addMovie));
router.delete('/:movieId/remove', asyncHandlerArray(removeMovie));

module.exports = router;
