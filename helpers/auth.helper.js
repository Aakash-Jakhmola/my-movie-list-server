const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const maxAge = 7*24*60*60; 

const createToken = user => {
  return jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{
    expiresIn: maxAge
  })
};

const invalidateToken = user => {
  return jwt.sign({id:user._id,username:user.username},process.env.JWT_INVALIDATE_SECRET,{
    expiresIn: maxAge
  })
};

const hashPassword = async(password) => {
  try {
    const salt = await bcrypt.genSalt(12) ;
    return await bcrypt.hash(password, salt);
  } catch(err) {
    console.log('Error occured during hasing', err);
    return null;
  }
};


module.exports = {
  createToken,
  invalidateToken,
  hashPassword,
}
