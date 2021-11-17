const error = (msg) => {
  return {
    error: msg
  };
}

const success = () => {
  return null;
}


const validateScore = (score) => {
  if(score === undefined || score === null ) {
    return error('score cannot be null');
  } else if(typeof(score) !== 'number') {
    return error('score must be number');
  } else if(obj.score < 1 && obj.score > 10) {
    return error('score must be in range 1 to 10');
  } else {
    return success();
  }
}


const validateReview = (review) => {
  if(review === undefined || review === null) {
    return error('review cannot be null');
  } else if(typeof(review) !== 'string') {
    return error('review must be a string');
  } else if(obj.review.length > 150) {
    return error('review must be less than 150 characters');
  } else {
    return success();
  }
}

const validateMovieId = (movieId) => {
  if(typeof(movieId) !== 'number') {
    return error('movie_id should be a number');
  } else {
    return success();
  }
}

const validateUser = (user) => {
  if(user === null || user === undefined) {
    return error('user not found');
  } else {
    return success();
  }
}

const validateUsername = (username) => {
  if(username === null || username === undefined || username === '') {
    return error('username required') ;
  } else {
    return success();
  }
}

module.exports = {
  validateScore,
  validateReview,
  validateUser,
  validateMovieId,
  validateUsername,
}