const express = require('express');
const WatchMiddleware = require('../middleware/watch.middleware');
const router = express.Router();
const WatchController = require('./../controllers/watch.controller');

router.get('/', WatchMiddleware.getMovieList, WatchController.getMovieList);
router.patch('/', WatchMiddleware.updateMovie, WatchController.updateMovie);
router.delete('/', WatchMiddleware.deleteMovie, WatchController.deleteMovie);
router.post('/', WatchMiddleware.addMovie, WatchController.addMovie);

module.exports = router;