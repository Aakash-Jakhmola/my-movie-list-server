const { Follow } = require("../models/Follow.model");

const getFollowers = async(req, res) => {
  try {
    const followers = await Follow.aggregate([
      { $match : {following : req.query.username}},
      { $project: {
        _id: 0,
        following: 0,
        __v: 0,
      }},
      { $lookup :  {
                    from : 'users',
                    localField: 'follower',
                    foreignField: 'username',
                    as: 'followers_details'
                  }
      },
      { $unwind : '$followers_details'}
    ]);
    res.status(401).send({success: true, data: followers});
  } catch(e) {
    res.send(500).send({success: false, message: "Internal Server Error"});
    console.log(e);
  }

};


const followUser = async (req, res) => {
  const user = await authenticateUser(req.cookies.jwt);
  const followingUsername = req.body.following_username;

  if (followingUsername === null || followingUsername === undefined || followingUsername === '') {
    res.status(401).send({ error: 'following_username cannot be empty' });
    return;
  } else if (typeof (followingUsername) !== 'string') {
    res.status(401).send({ error: 'following_username must be a string' });
    return;
  } else if (followingUsername === user.username) {
    res.status(401).send({ error: 'cannot follow self' });
    return;
  }

  try {
    const doc = await User.findOne({ username: followingUsername });
    if (doc) {
      const obj = new Follow({
        follower: user.username,
        following: followingUsername
      });
      await addFollower(obj);
      res.send('saved successfully');
    } else {
      res.status(401).send({ error: 'following user does not exist' });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
};


const unfollowUser = async (req, res) => {
  const user = await authenticateUser(req.cookies.jwt);
  const followingUsername = req.query.following_username;
  try {
    const obj = {
      follower: user.username,
      following: followingUsername
    };
    await removeFollower(obj);
    res.send('unfollowed successfully');
  } catch (e) {
   console.log(e);
    res.status(500).send('Internal Server Error');
  }
};

const FollowController = {
  getFollowers,
  followUser,
  unfollowUser,
};

module.exports = FollowController;