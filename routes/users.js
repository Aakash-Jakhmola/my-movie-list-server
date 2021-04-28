const express = require('express');
const router = express.Router();

const { User } = require('../models/user.js');
const followfunc = require('../core/followfunctions');
const postfunc = require('../core/postfunctions')
const passport = require('passport');



router.post("/register", function(req, res){
    res.contentType('application/json')
    let password = req.body.password ; 
    User.findOne({username : req.body.username}, function(err, foundUser){
        if(err) {
            res.send("400") ;
        } else {
            if(foundUser) {
                res.send("401") ;
            } else {
                User.register({
                    username : req.body.username, 
                    firstname : req.body.firstname,
                    lastname : req.body.lastname
                } , password, function(err,user){
                    if(err) {
                        console.log(err);
                        res.send("402") ;
                    } else {
                        passport.authenticate("local")(req, res, function(){
                            res.send("200") ;
                        }) ;
                    }
                }) ;
            }
        }
    }) 
});



router.post("/login", function(req, res, next){

    User.findOne({username: req.body.username}, function(err, foundUser){
        if(err)
            res.send(err) ;
        else {
            console.log(foundUser) ;
            if(!foundUser) {
                res.send("No user found") ;
            } else {
                passport.authenticate('local', (err, user, info) => {
                    if(err) {
                        res.send(err) ;
                        return next(err); 
                    } 
                    if(!user) {
                        return res.send({status : 400, message : "wrong password" }) ;
                    }
                    req.logIn(user, function(err){
                        if(err) {
                            res.send(err) ;
                            return next(err);
                        }
                        
                        
                        
                        return res.send({status : 200 , result : user}) ;
                    })
                })(req,res,next) ;
            }
        }
    })

    

});

router.get("/logout", function(req, res){
    req.logout() ;
    res.send("200") ;
});

router.get('/:userid', async (req, res) => {
    res.contentType('application/json')
    const id = req.params.userid
    console.log("i am here");
    User.findById(id)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.json(err)
        })

})

router.get('/:userid/movielist', function (req, res) {

    res.contentType('application/json')
    const userId = req.params.userid;
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

router.post('/:userid/addmovie', function (req, res) {

    //add movie to users movieList ... after that generate a post
    console.log("addmovie");
    const userID = req.params.userid
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

router.post('/:userid/follow', function (req, res) {
    const userId = req.params.userid;
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

router.get('/:userid/followers', (req, res) => {
    const userId = req.params.userid;
    followfunc.GetFollowersList(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        })
})

router.get('/:userid/following', (req, res) => {
    const userId = req.params.userid;
    followfunc.GetFollowingList(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        })
})

module.exports = router