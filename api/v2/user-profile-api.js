const router = require('express').Router();
const { User } = require('../../models/User.model');
const mongoose = require('mongoose');
const RequireAuth = require('./../../middleware/authMiddleware');
const { authenticateUser } = require('./../../utils/auth');
const { Follow } = require('../../models/Follow.model')
const { getFollowers, getFollowing, moviesCount, addFollower, removeFollower } = require('../../controllers/user.controller');


router.get('/search', RequireAuth, async (req, res) => {
  try {
    let currentUser = await authenticateUser(req.cookies.jwt);
    const docs = await User.find(
      {
        $or: [
          { username: { $regex: req.query.name, $options: "i" } },
          { firstname: { $regex: req.query.name, $options: "i" } },
          { lastname: { $regex: req.query.name, $options: "i" } }
        ]
      }
    );
    let result = [];
    let usernameToFollowMap = {};

    let usernames = docs.map((d) => d.username);
    const followingData = await Follow.aggregate([
      {
        $match: {
          $and: [
            { follower: currentUser.username },
            { following: { $in: usernames } }
          ]
        }
      },
    ]);
    console.log('result ', followingData);

    followingData.map((r) => {
      usernameToFollowMap[r.following] = true;
    })

    docs.map((user) => {
      result.push({
        user_details: user,
        is_following: usernameToFollowMap[user.username] != null
      });
    })
    res.send(result);

  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/followers', async (req, res) => {
  const followers = await getFollowers(req.query.username);
  if (followers) {
    res.send(followers);
  } else {
    res.status(500).send('Internal Server Error');
  }
});


router.get('/following', async (req, res) => {

  const following = await getFollowing(req.query.username);  
  if (following) {
    res.send(following);
  } else {
    res.status(500).send('Internal Server Error');
  }
})




router.get('/movies_count', async (req, res) => {
  const user = await authenticateUser(req.cookies.jwt);
  try {
    const result = await moviesCount(req.query.username);
    console.log(result);
    res.send({ movies_count: result });
    return;
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
})



module.exports = router;