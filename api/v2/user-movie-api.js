const express = require('express');
const router = express.Router();
const { Watch } = require('../../models/Watch.model');
const { saveMovie } = require('../../controllers/movie.controller');
const constants = require('../../constants/movie-list.constant');
const { authenticateUser } = require('../../utils/auth');
const  RequireAuth = require('../../middleware/authMiddleware');
const validator = require('../../utils/validator');
const { addMovieToUserList, removeMovieFromUserList} = require('../../controllers/user.controller')
const axios = require('axios');
const {Movie} = require('./../../core/objects');
const { GenreMap } = require('../../core/constants');
const URLS = require('./../../url');

/* 
  Returns movie list/ watch later list for the given usersname,

  query parameters
    - username       string       required
    - watch_later    boolean      optional    default(false)
    - page_number    number       optional    default(1)
    - sort_key       number       optional    default(time)    time, score
*/


router.get('/trending', async(req, res) => {
  try {
    const trendingData = await axios.get(URLS.TRENDING_MOVIE + '?api_key=' + process.env.API_KEY);
    console.log(trendingData.data.results);
    const trendingMovies = trendingData.data.results.map((movieData) => new Movie(movieData));
    res.send(trendingMovies);
  } catch(e) {  
    console.log(e);
    res.status(500).send('unsuccessfuLl');
  }

});

module.exports = router;