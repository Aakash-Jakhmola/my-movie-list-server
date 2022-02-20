const express = require('express');
const router = express.Router();
const {
  asyncHandler,
  asyncHandlerArray,
} = require('./../../utils/asyncHandler');

const addMovie = require('./addMovie');
const getMoviesByName = require('./getMoviesByName');
const getTrending = require('./getTrending');

router.get('/', asyncHandlerArray(getMoviesByName));
router.get('/trending', asyncHandlerArray(getTrending));
router.post('/add', asyncHandlerArray(addMovie));

module.exports = router;
