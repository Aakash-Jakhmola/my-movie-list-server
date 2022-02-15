const constants = require("../constants/movie-list.constant");
const { deleteMovieFromList, addMovieToList } = require("../helpers/watch.helper");
const { Watch } = require("../models/Watch.model");
const { authenticateUser } = require("../utils/authenticate");
const MovieController = require("./movie.controller");


const getMovieList = async (req, res) => {
  try {
    const username = req.query.username;
    let watchLater = false;
    if (req.query.watch_later && req.query.watch_later === 'true') {
      watchLater = true;
    }
    const query = {
      username,
      watch_later: watchLater,
    }
    let pageNumber = 1;
    if (req.query.page_number) {
      pageNumber = parseInt(req.query.page_number);
    }
    var sortKey = {};
    if (req.query.sort_key && req.query.sort_key === 'score') {
      sortKey['score'] = -1;
    } else {
      sortKey['_id'] = -1;
    }

    const result = await Watch.aggregate([
      { $match: query },
      { $sort: sortKey },
      { $skip: (pageNumber - 1) * constants.PAGE_SIZE },
      { $limit: constants.PAGE_SIZE },
      {
        $project: {
          "_id": 0,
          "user_id": 0
        }
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie_id',
          foreignField: 'movie_id',
          as: 'movie_details'
        }
      },
      {
        $unwind: '$movie_details'
      },
    ]);
    res.status(200).send({ success: true, data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

const addMovie = async (req, res) => {
  const user = await authenticateUser(req.cookies.jwt);
  const movieId = req.body.movie_id;
  const score = req.body.score;
  const review = req.body.review;
  let watchLater = false;
  if (req.body.watch_later && req.body.watch_later === true) {
    watchLater = true;
  }

  const obj = new Watch({
    username: user.username,
    movie_id: movieId,
    watch_later: watchLater,
  })

  if (!watchLater) {
    obj.score = score;
    obj.review = review;
  }

  let list = {};
  if (watchLater) {
    list['watch_later_count'] = 1;
  } else {
    list['movies_count'] = 1;
  }

  try {
    await MovieController.saveMovie(movieId);
    await addMovieToList(user, obj, obj, list);
    res.status(200).send({success: true, message: 'Movie added successfully'});
  } catch (e) {
    console.log("error occured during adding movie", e);
    res.status(500).send({success: false, message: 'could not add movie'});
  }
};


const updateMovie = async (req, res) => {
  const user = await authenticateUser(req.cookies.jwt);
  const movieId = req.body.movie_id;
 
  const obj = {};
  if (req.body.new_score)
    obj.score = req.body.new_score;
  if (req.body.new_review)
    obj.review = req.body.new_review;
  if (req.body.watch_later === true) {
    obj.watch_later = true;
  }


  let list = {};
  if (req.body.watch_later === false) {
    list['watch_later_count'] = -1;
    list['movies_count'] = 1;
  } else {
    list['movies_count'] = 0;
  }

  try {
    query = { movie_id: movieId, username: user.username };
    await addMovieToList(user, query, obj, list);
    res.send('updated successfully');
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};


const deleteMovie = async (req, res) => {
  try {
    const user = await authenticateUser(req.cookies.jwt);
    const query = {
      username: user.username,
      movie_id: req.body.movie_id,
      watch_later: req.body.watch_later
    };
    await deleteMovieFromList(query);
    res.status(200).send({ success: true, message: 'deleted successfully' });
  } catch (e) {
    console.log(e);
    res.status(500).send('deletion failed');
  }
};



const WatchController = {
  addMovie,
  deleteMovie,
  getMovieList,
  updateMovie,
};

module.exports = WatchController;