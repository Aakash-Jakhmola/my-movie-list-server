const express = require('express') ;
const router = express.Router() ;

const {User} = require('../models/user.js') ;
const followfunc = require('../core/followfunctions') ;
const postfunc = require('../core/postfunctions')

router.post('/register', function(req, res){
    res.contentType('application/json')
    const user1 = User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,

    });
    user1.save()
        .then(result=>{
            res.json(result)
        })
        .catch(err=>{
            res.json(err)
        })
}) ;

router.get('/:userid', function(req,res){
    res.contentType('application/json')
    const id = req.params.userid

    User.findById(id)
    .then(result =>{
        res.json(result)
    })
    .catch(err => {
        res.json(err)
    })

})

router.get('/:userid/movielist', function(req,res){

    res.contentType('application/json')
    const userId = req.params.userid;
    const orderby = req.query.orderby || 'time' ;
    console.log('orderby:',orderby)

    let movielist = [];

    var sortMovies = function () {
        
        if(orderby == 'rating') {
            movielist.sort((a,b)=>{
                if(a.rating > b.rating) {
                    return -1;
                }else if(a.rating < b.rating) {
                    return 1;
                } 
                return 0;
            })
            return ;
        } 

        movielist.sort((a,b)=> {
            if(a.time > b.time) {
                return -1 ;
            }else if (a.rating < b.rating) {
                return 1 ;
            }
            return 0;
        })

    }

    /*THERE MUST BE A BETTER WAY!*/

    User.findById(userId)
    .then(result =>{

        result.movies.forEach(element => {
            postfunc.RenderMovie(element.movieid)
                .then(movie=>{
                    movielist.push({
                        time: element._id.getTimestamp(),
                        movieid: element.movieid,
                        rating: element.rating,
                        movie: movie
                    }) ;

                    if(movielist.length == result.movies.length) {
                        sortMovies();
                        res.json(movielist);
                    }

                })
                .catch(err=>{
                    
                    movielist.push({
                        time: element._id.getTimestamp(),
                        movieid: element.movieid,
                        rating: element.rating,
                        error: err.error
                    })
    
                    if(movielist.length == result.movies.length) {
                        sortMovies();
                        res.json(movielist);
                    }

                });
        });
        
    })
    .catch(err => {
        res.json(err);
    }) ;

})

router.post('/:userid/addmovie',function(req,res){

    //add movie to users movieList ... after that generate a post

    const userID = req.params.userid
    const movieID = parseInt(req.body.movieid);
    const rating = parseInt(req.body.rating);

    const obj = {movieid:movieID,rating:rating}

    User.findByIdAndUpdate(userID,
        {$push: {movies: obj}},
        {safe: true, upsert: true})
        .then(result =>{
            //redirect to POST /posts to create post ... after successfully creating post ... add post to followers feed
            res.redirect(307,'/posts')
        })
        .catch(err=>{
            res.json(err);
        });
});

router.post('/:userid/follow',function(req,res) {
    const userId  = req.params.userid ;
    const friendId = req.body.friendid ;

    const obj = {userid: friendId} ;

    User.findByIdAndUpdate(userId,
        {$push: {following: obj}},
        {safe: true, upsert: true})
        .then(result =>{
            res.json(result);
            // update followersList of friend
            followfunc.AppendFollowersList(userId,friendId)
        })
        .catch(err=>{
            res.json(err);
        });
        
});

router.get('/:userid/followers',(req,res)=>{
    const userId = req.params.userid ;
    followfunc.GetFollowersList(userId)
    .then(result =>{
        res.json(result) ;
    })
    .catch(err=>{
        res.json(err);
    })
})

router.get('/:userid/following',(req,res)=>{
    const userId = req.params.userid ;
    followfunc.GetFollowingList(userId)
    .then(result =>{
        res.json(result) ;
    })
    .catch(err=>{
        res.json(err);
    })
})

module.exports = router