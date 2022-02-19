const { User } = require('../../database/models');
const ErrorHandler = require('../../utils/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./../../../config');

function getAuthToken(user) {
  const maxAge =  7*24*60*60;
  return jwt.sign(
    { userId: user._id, username: user.username },
    config.JWT_SECRET,
    {
      expiresIn: maxAge,
    }
  );
};

async function login({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Could not find user with username: ${username}`,
    });
  }
  const isPassCorrect = await bcrypt.compare(password, user.password);
  if (!isPassCorrect) {
    return ErrorHandler.throwError({
      code: 401,
      message: `Wrong password for username: ${username}`,
    });
  }

  return { 
    token: await getAuthToken(user), 
    user: user.safeObject(),
  };
}

module.exports = login;
