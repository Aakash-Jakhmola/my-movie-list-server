const mongoose = require('mongoose') ;

const userSchema = mongoose.Schema({
    name : String ,
    email : String, 
    moviesList : [{
        movieId : Number, 
        rating : Number
    }],
    friendsList : [{
        userId : String,
    }],
}) ;

const User = mongoose.model('user',userSchema) ;

module.exports = {
    User : User,
}