const mongoose = require('mongoose') ;

const userSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required: true,
    },
    
    lastname : String,
    username : {
		type: String,
		required : true,
        unique:true
	},
    
    password : {
        type : String,
        required : true
    },

    movies : [new mongoose.Schema({
        movieid : Number, 
        rating : Number,
        review : String
    })],

    followers : [{
        userid : String,
        username : String, 
        firstname : String, 
        lastname : String,
        _id : false 
    }],

    following : [{
        userid : String,
        username : String, 
        firstname : String, 
        lastname : String,
        _id : false 
    }]
}) ;

const User = mongoose.model('User',userSchema) ;

module.exports = {
    User : User,
}