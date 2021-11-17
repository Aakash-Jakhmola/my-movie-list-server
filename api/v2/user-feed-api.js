const router = require('express').Router();
const RequireAuth = require('./../../middleware/authMiddleware');
const { authenticateUser } = require('./../../utils/auth')
const { User } = require('./../../models/user');
const { Watch } = require('../../models/watch');
const constants = require('./../../constants/movie-list.constant')

router.get('/feed', RequireAuth, async(req, res) => {
  const user = await authenticateUser(req.cookies.jwt) ;
  let pageNumber = 1;
  if(req.query.page_number) {
    pageNumber = parseInt(req.query.pageNumber) ;
  }
  
  try {
    const followersData = await User.findOne( {username : user.username} , {_id: 0, 'following.username': 1} );
    const followers = [];

    followersData.following.map((val) => {
      followers.push(val.username);
    })

    const result = await Watch.aggregate([
      { $match : { username : { $in : followers}, }},
      { $sort : { _id: 1}},
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