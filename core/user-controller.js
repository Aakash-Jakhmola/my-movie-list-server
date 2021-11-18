const { User } = require('./../models/user');

const updateMovieCount = async(user_id, list_type, amount) => {

  const query = {};
  query[list_type] = amount;
  
  try {
    await User.findByIdAndUpdate(user_id, 
      { $inc : query }
    )
  } catch(e) {

  }
}

module.exports = {
  updateMovieCount,

}