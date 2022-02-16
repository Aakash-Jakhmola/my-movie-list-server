const { User } = require("../../domain");

async function createAccount(req, res) {

  const { firstname, lastname, username, password } = req.body; 
  const createdUser = await User.createAccount({
    username,
    password,
    firstname,
    lastname,
  });

  res.json(createdUser);

}

module.exports = createAccount;