const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const followfunc = require('../core/followfunctions');
const postfunc = require('../core/postfunctions')
const bcrypt = require('bcryptjs')


router.post("/register", function (req, res) {
    res.contentType('application/json')

    const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password : req.body.password
    })

    bcrypt.genSalt(12, (err, salt) =>{
        if(err) {
            res.status(500);
            return;
        }
        bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                // Save user
                newUser.save()
                .then((result)=>{
                        res.json(result)
                        console.log(result)
                    }
                )
                .catch((err) => res.json({error:err.message}));
            })
        }  
    );
});

router.post("/login", function (req, res, next) {

    User.findOne({ username: req.body.username }, function (err, foundUser) {
        if (err)
            return res.status(401);
        else {
            console.log(foundUser);
            if (!foundUser) {
                return res.status(401);
            } else {
                bcrypt.compare(req.body.password, foundUser.password).then((isMatch) => {
                    if (!isMatch) return res.status(401);
                    res.send({
                        username : foundUser.username,
                        userid : foundUser._id,
                        following_count : foundUser.following.length,
                        followers_count : foundUser.followers.length,
                        movies_count:foundUser.movies.length,
                        firstname : foundUser.firstname,
                        lastname : foundUser.lastname
                        
                    }); // sends userId
                })
            }
        }
    })
});

// router.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//         //delete session data from store, using sessionID in cookie
//         if (err) throw err;
//         res.clearCookie("session-id"); // clears cookie containing expired sessionID
//         res.send("Logged out successfully");
//     });
// });

// router.get("/authchecker", (req, res) => {
//     const sessUser = req.session.user;
//     if (sessUser) {
//         return res.json({ msg: " Authenticated Successfully", sessUser });
//     } else {
//         return res.status(401).json({ msg: "Unauthorized" });
//     }
// });

router.get('/:username', async (req, res) => {
    res.contentType('application/json')
    const username = req.params.username
    // User.findOne({username:username})
    //     .then(result => {
    //         res.json(result)
    //     })
    //     .catch(err => {
    //         res.json(err)
    //     })

    User.aggregate([
        { $match : {username : username}},
        {
            $project : {
                username:1,
                firstname:1,
                lastname:1,
                movies_count : {$size : '$movies'},
                followers_count : {$size : '$followers'},
                following_count : {$size : '$following'},
            }
        }
    ])
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        res.json({error:err.message})
    })

})

router.get('/:username/movielist', function (req, res) {

    res.contentType('application/json')
    const username = req.params.username;
    const orderby = req.query.orderby || 'time';
    console.log('orderby:', orderby)

    let movielist = [];

    var sortMovies = function () {

        if (orderby == 'rating') {
            movielist.sort((a, b) => {
                if (a.rating > b.rating) {
                    return -1;
                } else if (a.rating < b.rating) {
                    return 1;
                }
                return 0;
            })
            return;
        }

        movielist.sort((a, b) => {
            if (a.time > b.time) {
                return -1;
            } else if (a.time < b.time) {
                return 1;
            }
            return 0;
        })

    }

    /*THERE MUST BE A BETTER WAY!*/

    User.findOne({username:username})
        .then(result => {

            if(result.movies.length == 0) {
                res.json([]) ;
                return ;
            }

            result.movies.forEach(element => {
                postfunc.RenderMovie(element.movieid)
                    .then(movie => {
                        movielist.push({
                            time: element._id.getTimestamp(),
                            movieid: element.movieid,
                            rating: element.rating,
                            review : element.review,
                            movie: movie
                        });

                        if (movielist.length == result.movies.length) {
                            sortMovies();
                            res.json(movielist);
                        }

                    })
                    .catch(err => {

                        movielist.push({
                            time: element._id.getTimestamp(),
                            movieid: element.movieid,
                            rating: element.rating,
                            review : element.review,
                            error: err.error
                        })

                        if (movielist.length == result.movies.length) {
                            sortMovies();
                            res.json(movielist);
                        }

                    });
            });

        })
        .catch(err => {
            res.json(err);
        });

})

router.post('/addmovie', async (req, res) => {
    const userID = req.body.userid
    const movieID = parseInt(req.body.movieid);
    const rating = parseInt(req.body.rating);
    const review = req.body.review;

    const obj = { movieid: movieID, rating: rating, review : review }

    let userExists = await User.countDocuments({_id:userID})
    if(userExists == 0){
        res.json({error:"User does not exists"})
        return ;
    }

    // check if movie is already added 
    // User.aggregate([
    //     {$match : {_id : userID}},
    //     {movies : {$in :[{movieid:movieID}]}}
    // ])
    // .then((result)=>{
    //     console.log(result)
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })

    User.findByIdAndUpdate(userID,
        { $push: { movies: obj } },
        { safe: true, upsert: true })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.json(err);
        });
});

router.post('/follow', function (req, res) {
   
    const userId = req.body.userid;
    const friendId = req.body.friendid;
    const friendFirstName = req.body.firstname;
    const friendLastName = req.body.lastname ;
    const friendUsername = req.body.username ;
    const obj = { 
        userid: friendId,
        username : friendUsername,
        firstname : friendFirstName,
        lastname : friendLastName
     };

    User.findByIdAndUpdate(userId,
        { $push: { following: obj } },
        { safe: true, upsert: true })
        .then(result => {
            res.status(200).end();
            // update followersList of friend
            /*TODO: Add error handling*/
            followfunc.AppendFollowersList(userId, friendId)
        })
        .catch(err => {
            res.json(err);
        });

});

router.get('/followers', (req, res) => {
    const userId = req.body.userid;
    followfunc.GetFollowersList(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        })
})

router.get('/following', (req, res) => {
    const userId = req.body.userid;
    followfunc.GetFollowingList(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        })
})

router.get('/:username/followers', (req,res)=>{
    const username = req.params.username ;
    User.findOne({username : username}, (err, foundUser)=>{
        if(err) 
            return res.status(400);
        else {
            res.send(foundUser.followers) ;
        }
    })
})

router.get('/:username/following', (req,res)=>{
    const username = req.params.username ;
    User.findOne({username : username}, (err, foundUser)=>{
        if(err) 
            return res.status(400);
        else {
            res.send(foundUser.following) ;
        }
    })
})

module.exports = router