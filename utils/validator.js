const error = (msg) => {
  return {
    error: msg
  };
}


const validateScore = (score) => {
  if(score === undefined || score === null ) {
    return error('score cannot be null');
  } else if(typeof(score) !== 'number') {
    return error('score must be number');
  } else if(obj.score < 1 && obj.score > 10) {
    return error('score must be in range 1 to 10');
  } else {

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

  }
}

module.exports = {
  validateScore,
  validateReview,
}