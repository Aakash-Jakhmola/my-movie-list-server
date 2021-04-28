const mongoose = require('mongoose') ;
const passport = require('passport') ;
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose') ;

var ValidateEmail = function(email) {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email)
};

const userSchema = new mongoose.Schema({
    firstname : {
        type:String,
       // required: true,
    },
    
    lastname : String,
    username : {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
    	required: 'Email address is required',
		// we can use either validate or match 
    	validate: [ValidateEmail, 'Please fill a valid email address'],
		//match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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
    }]

}) ;

userSchema.plugin(passportLocalMongoose) ; 


const User = mongoose.model('User',userSchema) ;

module.exports = {
    User : User,
}