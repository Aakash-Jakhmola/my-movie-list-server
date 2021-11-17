const jwt = require('jsonwebtoken')

const authenticateUser = async (token) => {
  let user = null;
  if(token) {
    await jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken) => {
      if(!err) {
        user = decodedToken;
      }
    })
  } 
  return user ;
}

module.exports = {
  authenticateUser
}