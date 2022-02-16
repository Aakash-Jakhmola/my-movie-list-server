const { User } = require("../../domain");


async function getFollowing(req, res) {
  const { username } = req.params;
  const { viewer } = req.query ;

  const following = await User.getFollowing({username, viewer });

  res.json(following);

}

module.exports = getFollowing;