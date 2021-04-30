const mongoose = require('mongoose') ;

const userSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required: true,
    },
    
    lastname : String,
    username : {
		type: String,
		required : true
	},
    
    password : {
        type : String,
        required : true
    },

    movies : [new mongoose.Schema({
        movieid : Number, 
        rating : Number,
    })],

    followers : [{
        userid : String,
        _id : false 
    }],

    following : [{
        userid : String,
        _id : false 
    }],

    posts : [{
        postid : String,
        _id : false
    }],

    feed : [{
        postid : String,
        _id : false
    }],
    
    date : {
        type : Date, 
        defaut : Date.now
    }

}) ;

const User = mongoose.model('User',userSchema) ;

module.exports = {
    User : User,
}