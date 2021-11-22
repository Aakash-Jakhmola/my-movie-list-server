const router = require('express').Router();
const RequireAuth = require('./../../middleware/authMiddleware');
const { authenticateUser } = require('./../../utils/auth')
const { Watch } = require('../../models/watch');
const constants = require('./../../constants/movie-list.constant');
const { getFollowing } = require('./../../controllers/user-controller');


router.get('/feed', RequireAuth, async(req, res) => {
  const user = await authenticateUser(req.cookies.jwt) ;
  let pageNumber = 1;
  if(req.query.page_number) {
    pageNumber = parseInt(req.query.page_number) ;
  }
  
  try {
    const followersData = await getFollowing(user.username);
    const followers = [];

    followersData.map((val) => {
      followers.push(val.following_details.username);
    })

    const result = await Watch.aggregate([
      { $match : { username : { $in : followers}, }},
      { $sort : { _id: -1}},
      { $skip : (pageNumber- 1) * constants.PAGE_SIZE },
      { $limit : constants.PAGE_SIZE },
      { $project: { 
              "_id": 0,
              "user_id": 0
            }
      },
      { $lookup: {
              from : 'movies',
              localField: 'movie_id',
              foreignField: 'movie_id',
              as: 'movie_details'
            }
      },
      { $unwind: '$movie_details' },
    ]);
    res.send(result);
  } catch(e) {
    console.log(e);
    res.send('error occurred');
  }
  

});


module.exports = router;