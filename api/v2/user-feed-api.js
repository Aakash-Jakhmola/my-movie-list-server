const router = require('express').Router();
const RequireAuth = require('./../../middleware/authMiddleware');
const { authenticateUser } = require('./../../utils/auth')
const { User } = require('./../../models/user');
const { Watch } = require('../../models/watch');

router.get('/feed', RequireAuth, async(req, res) => {
  const user = await authenticateUser(req.cookies.jwt) ;
  try {
    const followers = await User.findOne( {username : username} , {_id: 0, "followers.username": 1} );
    const result = await Watch.aggregate([
      {$match : { username : { $in : followers} }},
    ]);
    console.log(result);
  } catch(e) {

  }

});



module.exports = router;