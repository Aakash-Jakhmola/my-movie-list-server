const express = require('express')
const router = express.Router()

const {User} = require('../models/user.js')

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
    const id = req.params.userid;
    console.log(id)

    User.findById(id)
    .then(result =>{
        res.json(result.moviesList);
    })
    .catch(err => {
        res.json(err);
    })
})

router.post('/:userid/addmovie',function(req,res){
    const userID = req.params.userid

    //movieid and rating is accepted from req.body
    const movieID = parseInt(req.body.movieid);
    const rating = parseInt(req.body.rating);
    console.log(userID,movieID,rating);

    const obj = {movieId:movieID,rating:rating}

    User.findByIdAndUpdate(userID,
        {$push: {moviesList: obj}},
        {safe: true, upsert: true})
        .then(result =>{
            res.json(result)
        })
        .catch(err=>{
            res.json(err)
        })

})


module.exports = router