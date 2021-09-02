const jwt = require('jsonwebtoken')
const maxAge = 7*24*60*60

const CreateToken = (user_data) =>{
  return jwt.sign({id:user_data._id,username:user_data.username},process.env.JWT_SECRET,{
    expiresIn: maxAge
  })
}

const InvalidateToken  =user_data=>{
  return jwt.sign({id:user_data._id,username:user_data.username},process.env.JWT_INVALIDATE_SECRET,{
    expiresIn: maxAge
  })
}

module.exports = {
  CreateToken:CreateToken,
  InvalidateToken: InvalidateToken
}
