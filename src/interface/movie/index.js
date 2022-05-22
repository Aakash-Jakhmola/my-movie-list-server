const express = require('express');
const router = express.Router();
const {
  asyncHandler,
  asyncHandlerArray,
} = require('./../../utils/asyncHandler');

const addMovie = require('./addMovie');
const editMovie = require('./editMovie');
const getMovieList = require('./getMovieList');
const getMoviesByName = require('./getMoviesByName');
const getTrending = require('./getTrending');
const removeMovie = require('./removeMovie');

router.get('/', asyncHandlerArray(getMoviesByName));
router.get('/trending', asyncHandlerArray(getTrending));
router.get('/list', asyncHandlerArray(getMovieList));
router.post('/add', asyncHandlerArray(addMovie));
router.put('/:movieId/edit', asyncHandlerArray(editMovie));
router.delete('/:movieId/remove', asyncHandlerArray(removeMovie));

module.exports = router;
