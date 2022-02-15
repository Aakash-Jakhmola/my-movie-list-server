const { User } = require('../models/User.model');
const { userObject } = require('../helpers/user.helper');
const { Follow } = require('../models/Follow.model');


const getUser = async(req, res) => {
  try {
    const user = await User.findOne({username: req.body.username}); 
    res.status(200).send({success: true, data: await userObject(user) }) ;
  } catch(e) {
    console.log('Getting User Failed', e);
    res.status(500).send({message: false, message: 'Internal Server Error'});
  }
};



const searchUser = async(req, res) => {
  try {
    let currentUser = await authenticateUser(req.cookies.jwt);
    const docs = await User.find({
        $or: [
          { username: { $regex: req.query.name, $options: "i" } },
          { firstname: { $regex: req.query.name, $options: "i" } },
          { lastname: { $regex: req.query.name, $options: "i" } }
        ]
    });
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
};



const UserController = {
  getUser,
  searchUser,
}

module.exports = UserController;