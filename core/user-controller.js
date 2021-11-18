const { User } = require('./../models/user');

const updateMovieCount = async(user_id, list) => {

  const query = {};
  list.map((item) => {
    query[item.type] = item.amount;
  })
  
  
  await User.findByIdAndUpdate(user_id, 
    { $inc : query }
  )
  
}

module.exports = {
  updateMovieCount,

}