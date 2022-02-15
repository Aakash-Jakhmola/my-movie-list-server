const { createToken, hashPassword } = require('../helpers/auth.helper');
const { User } = require('./../models/User.model');
const bcrypt = require('bcryptjs');
const { userObject } = require('../helpers/user.helper');


const register = async(req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: await hashPassword(req.body.password),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    await user.save();
    res.status(200)
       .send({
          success: true,
          message: 'User created successfully', 
        });
    console.log('User created successfully');
  } catch(err) {
    console.log('Error occured during register', err);
    res.status(500).send({success: false, message: 'Internal Server Error'});
  }
};


const login = async(req, res) => {
  console.log(req.cookies);
  try {
    const user = await User.findOne({username: req.body.username});
    if(!user) {
      res.status(400).send({success: false, message: 'No user exists with such username'});
      return;
    }
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.cookie('jwt', createToken(user), {maxAge:7*24*60*60*1000, path:'/'});
      res.status(200).send({success: true, data: userObject(user), message: 'login successfully'});
    } else {
      res.status(401).send({success: false, message: 'Wrong password'});
    }
  } catch(err) {
    console.log(err);
    res.status(500).send({success: false, message: 'Internal Server Error'});
  }
};


const logout = async(req, res) => {
  const token = 'somefaketoken';
  res.cookie('jwt',token,{maxAge:0, secure:true,sameSite:'none',path:'/'});
  res.status(200).send({success: true, message:'Logged out successfully'});
}


const AuthController = {
  register,
  login,
  logout,
};

module.exports = AuthController;