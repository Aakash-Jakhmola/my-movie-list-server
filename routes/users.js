const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const followfunc = require('../core/followfunctions');
const postfunc = require('../core/postfunctions')
const bcrypt = require('bcryptjs')


router.post("/register", function (req, res) {
    res.contentType('application/json')
    
    User.findOne({ username: req.body.username }, function (err, foundUser) {
        if (err) {
            res.status(400);
        } else {
            if (foundUser) {
                res.status(401);
            } else {
                const newUser = new User({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password : req.body.password
                })
                console.log(newUser)
                bcrypt.genSalt(12, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;
                        // Save user
                        newUser
                            .save()
                            .then(
                                res.json({
                                    msg: "Successfully Registered"
                                })
                            )
                            .catch((err) => res.json(400));
                    })
                );
            }
        }
    })
});



router.post("/login", function (req, res, next) {

    User.findOne({ username: req.body.username }, function (err, foundUser) {
        if (err)
            res.send("NETWORK ERROR1");
        else {
            console.log(foundUser);
            if (!foundUser) {
                res.send("No user found");
            } else {
                bcrypt.compare(req.body.password, foundUser.password).then((isMatch) => {
                    if (!isMatch) return res.send("Invalid Password");

                    res.send({
                        username : foundUser.username,
                        userid : foundUser._id,
                        movies : foundUser.movies,
                        
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

router.get('/:userid', async (req, res) => {
    res.contentType('application/json')
    const id = req.params.userid
    User.findById(id)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.json(err)
        })

})

router.get('/movielist', function (req, res) {

    res.contentType('application/json')
    const userId = req.body.userid;
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
            } else if (a.rating < b.rating) {
                return 1;
            }
            return 0;
        })

    }

    /*THERE MUST BE A BETTER WAY!*/

    User.findById(userId)
        .then(result => {

            result.movies.forEach(element => {
                postfunc.RenderMovie(element.movieid)
                    .then(movie => {
                        movielist.push({
                            time: element._id.getTimestamp(),
                            movieid: element.movieid,
                            rating: element.rating,
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

router.post('/addmovie', function (req, res) {
    const sessUser = req.session.user;
    const userID = req.body.userid

    if(sessUser) {
        if(sessUser.id != userID)
            return res.status(401) ;
    } else {
        return res.status(401) ;
    }


    const movieID = parseInt(req.body.movieid);
    const rating = parseInt(req.body.rating);

    const obj = { movieid: movieID, rating: rating }

    User.findByIdAndUpdate(userID,
        { $push: { movies: obj } },
        { safe: true, upsert: true })
        .then(result => {
            //redirect to POST /posts to create post ... after successfully creating post ... add post to followers feed
            res.redirect(307, '/posts')
        })
        .catch(err => {
            res.json(err);
        });
});

router.post('/follow', function (req, res) {
   
    const userId = req.body.userid;


    if(sessUser) {
        if(sessUser.id != userId)
            return res.status(401) ;
    } else {
        return res.status(401) ;
    }
   
   
    const friendId = req.body.friendid;

    const obj = { userid: friendId };

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

module.exports = router