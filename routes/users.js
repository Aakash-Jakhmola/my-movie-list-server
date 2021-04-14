const express = require('express')
const router = express.Router()

const {User} = require('../models/user.js')

router.post('/', function(req, res){
    res.render("home", {data : []}) ;
    const user1 = User({
        name : "aakash",
        email : "aakash001jakhmola@gmail.com",

    });
    user1.save().then(()=> {console.log('Successful');}) ;
}) ;

module.exports = router