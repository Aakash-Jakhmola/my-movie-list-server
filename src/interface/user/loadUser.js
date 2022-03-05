const { User } = require('../../domain');

async function loadUser(req, res) {
  const username = req.username;
  const users = await User.getAccount({ username });
  res.json(users);
}

module.exports = [loadUser];
