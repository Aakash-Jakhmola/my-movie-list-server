const { User } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");
const bcrypt = require('bcryptjs');


async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12) ;
  const hashedPassword =  await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function createAccount({username, password, firstname, lastname}) {
  const foundUser = User.findOne({username});
  if(foundUser) {
    return ErrorHandler.throwError({
      code: 403,
      message: `Username with username: ${username} already exists`,
    });
  }

  const createdUser = await new User({
    username,
    password: await hashPassword(password),
    firstname,
    lastname,
  }).save();

  return createdUser;

}

module.exports = createAccount;