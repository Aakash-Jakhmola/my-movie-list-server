const getFollowing = async(req, res) => {

  try {
    const following = await Follow.aggregate([
      { $match : { follower : req.query.username}},
      { $project: {
        _id: 0,
        username: 0,
        __v: 0,
      }},
      { $lookup :  {
                    from : 'users',
                    localField: 'following',
                    foreignField: 'username',
                    as: 'following_details'
                  }
      },
      { $unwind : '$following_details'}
    ]);
    res.send({success: true, data: following});
  } catch(e) {
    console.log(e);
  }
  return following;
};

const FollowingController = {
  getFollowing,
};

module.exports = FollowingController;