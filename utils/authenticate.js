const jwt = require('jsonwebtoken')

const authenticateUser = async (token) => {
  if(!token) {
    return null;
  } else {
    try {
      const user = await jwt.verify(token, process.env.JWT_SECRET);
      return user;
    } catch(e) {
      console.log('authenticate user', e);
      return null;
    }
  }
}

module.exports = {
  authenticateUser
}