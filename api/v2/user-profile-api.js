const router = require('express').Router();
const { User } = require('./../../models/user');

router.get('/followers', async(req, res) => {
  const username = req.query.username;
  try {
    const followers = await User.findOne({username : username}, {followers: 1});
    console.log(followers);
  } catch(e) {

  }

});


module.exports = router;