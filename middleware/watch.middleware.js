const { Watch } = require("../models/Watch.model");
const { authenticateUser } = require("../utils/authenticate");

const addMovie = async (req, res, next) => {
  if (!req.cookies) {
    res.status(401).send({ success: false, message: 'Unauthorized' });
    return;
  } else {
    const user = await authenticateUser(req.cookies.jwt);
    if (!user) {
      res.status(401).send({ success: false, message: 'Unauthorized' });
      return;
    }
    if (!req.body.movie_id) {
      res.status(400).send({ success: false, message: 'Movie Id is missing' });
      return;
    }
    if (!req.body.watch_later) {
      if (!req.body.score) {
        res.status(400).send({ success: false, message: 'Score is missing' });
        return;
      } else if (!req.body.review) {
        res.status(400).send({ success: false, message: 'Review is missing' });
        return;
      }
    }
    try {
      const doc = await Watch.findOne({ movie_id: req.body.movie_id, username: user.username });
      console.log(doc);
      if (doc) {
        res.status(401).send({ success: false, message: 'Movie already Added' });
        return;
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ success: false, message: 'Internal Server Error' });
      return;
    }
    next();
  }
};


const updateMovie = (req, res, next) => {

};


const getMovieList = (req, res, next) => {
  if (!req.query.username) {
    res.status(400).send({ success: false, message: 'Username missing' });
  } else {
    next();
  }
};


const deleteMovie = async (req, res, next) => {
  if (!req.cookies) {
    res.status(401).send({ success: false, message: 'Unauthorized' });
  } else {
    const user = await authenticateUser(req.cookies.jwt);
    if (!user) {
      res.status(401).send({ success: false, message: 'Unauthorized' });
    } else if (!req.body.movie_id) {
      res.status(400).send({ success: false, message: 'Movie Id is missing' });
    } else if (!req.body.watch_later) {
      res.status(400).send({ success: false, message: 'Watch Later is missing' });
    } else {
      next();
    }
  }
};


const WatchMiddleware = {
  addMovie,
  deleteMovie,
  getMovieList,
  updateMovie,
};

module.exports = WatchMiddleware;