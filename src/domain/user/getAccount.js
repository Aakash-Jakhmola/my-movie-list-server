const { User } = require("../../database/models");
const ErrorHandler = require("../../utils/errorHandler");

async function getAccount({username, search}) {
  if(username) {
    const foundUser = await User.findOne({username});
    if(!foundUser) {
      return ErrorHandler.throwError({
        code: 404,
        message: `could not find user with username: ${username}`,
      })
    }
  }
}

module.exports = getAccount;