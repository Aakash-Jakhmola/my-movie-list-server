const express = require('express');
const router = express.Router();
const { Watch } = require('../../models/watch');
const { saveMovie } = require('../../core/movies/movie-controller');
const constants = require('../../constants/movie-list.constant');
const { authenticateUser } = require('../../utils/auth');
const  RequireAuth = require('../../middleware/authMiddleware');
const validator = require('../../utils/validator');
const {User} = require('./../../models/user');


router.get('/fetch_movie_list', async(req, res) => {
  const username = req.query.username;
  const validateMsg = validator.validateUsername(username)
  if(validateMsg) {
    res.status(401).send(validateMsg);
    return;
  }

  let watchLater = false ;

  if(req.query.watch_later && req.query.watch_later === 'true') {
    watchLater = true;
  }

  const query = {
    username,
    watch_later: watchLater,
  }

  let pageNumber = 1;
  if(req.query.page_number) {
    pageNumber = parseInt(req.query.page_number) ;
  }

  var sortKey = {};
  if(req.query.sort_key && req.query.sort_key === 'score' ) {
    sortKey['score'] = -1;
  } else  {
    sortKey['_id'] = 1;
  }
  
  try {
    const result = await Watch.aggregate([
        { $match: query },
        { $sort : sortKey },
        { $skip : (pageNumber- 1) * constants.PAGE_SIZE },
        { $limit : constants.PAGE_SIZE },
        { $project: { 
                      "_id": 0,
                      "user_id": 0
                    }
        },
        { $lookup: {
                      from : 'movies',
                      localField: 'movie_id',
                      foreignField: 'movie_id',
                      as: 'movie_details'
                    }
        },
        {
          $unwind: '$movie_details'
        },
      ]);
    res.send(result);
  } catch(err) {
    console.log(err);
    res.status(401).send('fetch failed');
  }
})

router.patch('/update_movie', RequireAuth, async (req, res) => {
  const user = await authenticateUser(req.cookies.jwt) ;
  const movieId = req.query.movie_id;

  const obj = {};
  if(req.body.new_score)
    obj.score = req.body.new_score;
  if(req.body.new_review) 
    obj.review = req.body.new_review;
  if(req.body.watch_later === true) {
    obj.watch_later = true;
  }
  if(req.body.watch_later === false) {
    obj.watch_later = false;
  }
  
  try {
    query = { movie_id: movieId, username: user.username };
    await Watch.updateMany(query, obj, {upsert: true, safe: true});
    res.send('updated successfully');
  } catch(e) {
    console.log(e);
    res.status(500).end();
  }
}) ; 

router.delete('/delete_movie', RequireAuth, async(req,res)=> {
  const user = await authenticateUser(req.cookies.jwt) ;
  const movieId = req.query.movie_id;

  try {
    const query = {
      username: user.username,
      movie_id: movieId
    };
    await Watch.deleteOne(query);
    res.send('deleted successfully');
  } catch(e) {
    res.status(500).send('deletion failed');
  }
}) 


router.post('/add_movie', RequireAuth, async (req, res) => {
  
  const user = await authenticateUser(req.cookies.jwt) ;
  const movieId = req.query.movie_id;
  const score = req.body.score;
  const review = req.body.review;
  
  let watchLater = false ;
  if(req.body.watch_later && req.body.watch_later === 'true') {
    watchLater = true;
  }

  const obj = new Watch({
    username: user.username,
    movie_id: movieId,
    watch_later: watchLater,
  })

  if(watchLater) {
    obj.score = score;
    obj.review = review;
  }
  try {
    const movie = await saveMovie(movieId);
    console.log('movie : ',movie);
    if(movie) {
      await obj.save();
      res.send('updated successfully');
    } else {
      res.status(401).send('addition unsuccessfully');
    }
  } catch(err) {
    res.status(401).send('addition unsuccessfully');
  }
  res.end(); 
})

module.exports = router;