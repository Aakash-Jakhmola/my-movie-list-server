const { User } = require("../models/User.model");
const jwt = require('jsonwebtoken');
const { authenticateUser } = require("../utils/authenticate");

const register = async (req, res, next) => {
  try {
    if (!req.body.username) {
      res.status(400).send({ success: false, message: 'Username not provided' });
    }
    else if (!req.body.password) {
      res.status(400).send({ success: false, message: 'Password not provided' });
    } else {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        res.status(400).send({ succes: false, message: 'User with same username already exists' });
      } else {
        next();
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};


const login = (req, res, next) => {
  if(!req.body.username) {
    res.status(400).send({ success: false, message: 'Username not provided' });
  }
  else if(!req.body.password) {
    res.status(400).send({ success: false, message: 'Password not provided' });
  }
  else 
    next();
}


const logout = async(req, res, next) => {
  try {
    const user = await authenticateUser(req.cookies['jwt']);
    if(!user) {
      res.status(401).send({success:false, message: 'you need to login first'}); 
    } else {
      next();
    }
  } catch(e) {
    console.log(e);
    res.status(500).send({success: false, message: 'Internal Server Error'});
  }
}


const AuthMiddleware = {
  register,
  login,
  logout,
};

module.exports = AuthMiddleware;