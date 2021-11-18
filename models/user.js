const mongoose = require('mongoose') ;

const userSchema = new mongoose.Schema({
    firstname : {
      type: String,
      required: true,
    },
    
    lastname : String,
    
    username : {
		  type: String,
		  required : true,
      unique:true
	  },

    image: String,

    movies_count: {
      type: Number,
      default: 0,
    },

    watch_later_count: {
      type: Number,
      default: 0,
    },
    
    password : {
        type : String,
        required : true
    },

    followers : [{
        username: String,
        _id: false 
    }],

    following : [{
        username: String,
        _id: false
    }]
}) ;

const User = mongoose.model('User', userSchema) ;

module.exports = {
    User : User,
}