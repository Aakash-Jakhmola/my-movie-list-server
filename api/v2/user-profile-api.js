const router = require('express').Router();
const { User } = require('./../../models/user');
const RequireAuth = require('./../../middleware/authMiddleware');
const { authenticateUser } = require('./../../utils/auth');
const { Follow } = require('./../../models/follows')
const { getFollowers, getFollowing, moviesCount } = require('../../controllers/user-controller');
const { updateMovieCount } = require('../../controllers/user-controller');

router.get('/followers', async(req, res) => {
  const followers = await getFollowers(req.query.username);
  console.log(followers);
  if(followers) {
    res.send(followers);
  } else {
    res.status(500).send('Internal Server Error');
  }
});


router.get('/following', async(req, res) => {
  const following = await getFollowing(req.query.username);
  if(following) {
    res.send(following);
  } else {
    res.status(500).send('Internal Server Error');
  }
})


router.post('/follow', RequireAuth ,async(req, res) => { 
  const user = await authenticateUser(req.cookies.jwt);

  console.log(user);
  const followingUsername = req.body.following_username;
  
  if(followingUsername === null || followingUsername === undefined || followingUsername === '') {
    res.status(401).send({error: 'following_username cannot be empty'});
    return;
  } else if(typeof(followingUsername) !== 'string') {
    res.status(401).send({error: 'following_username must be a string'});
    return;
  } else if(followingUsername === user.username) {
    res.status(401).send({error: 'cannot follow self'});
    return;
  }

  try { 
    const doc = await User.findOne({username : followingUsername});
    if(doc) {
      const obj = new Follow({
        username : user.username,
        following_username : followingUsername
      });
      await obj.save();
      updateMovieCount(user.username, [{ type: 'following_count', amount: 1}]);
      updateMovieCount(followingUsername, [{type: 'followers_count', amount: 1}]);
      res.send('saved successfully');
    } else {
      res.status(401).send({error: 'following user does not exist'});
      return;
    }
  } catch(e) {
    res.status(500).send('Internal Server Error');
  } 
})

router.delete('/unfollow', RequireAuth, async(req, res) => {
  const user = await authenticateUser(req.cookies.jwt);
  const followingUsername = req.query.following_username ;
  try {
    const doc = await Follow.findOneAndDelete({username : user.username, following_username: followingUsername});
    if(doc) {
      await Promies.all( [ updateMovieCount(user.username, [{ type: 'following_count', amount: -1}]),
                           updateMovieCount(followingUsername, [{type: 'followers_count', amount: -1}]) ]);
      res.send('unfollowed successfully');
    } else {
      res.status(401).send({error: 'could not find document'});
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/movies_count', async(req,res)=>{
  const user= await authenticateUser(req.cookies.jwt);
  try {
    const result = await moviesCount(req.query.username);
    console.log(result);
    res.send({movies_count: result});
    return;
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
})



module.exports = router;