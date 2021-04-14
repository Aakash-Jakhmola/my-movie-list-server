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
        res.send(err)
    })

})

router.get('/:userid/movielist', function(req,res){
    res.contentType('application/json')
    const id = req.params.id

    User.find(id)
    .then(result =>{
        res.json(result.moviesList)
    })
    .catch(err => {
        res.send(err)
    })
})


module.exports = router