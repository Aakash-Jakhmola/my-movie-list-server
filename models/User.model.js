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

    password : {
      type : String,
      required : true
    },

    image: String,

    movies_count: {
      type: Number,
      default: 0,
      required: true
    },

    watch_later_count: {
      type: Number,
      default: 0,
      required: true
    },
    
    followers_count : {
      type: Number,
      default: 0,
      required: true
    },

    following_count : {
      type: Number,
      default: 0,
      required: true
    },
    
}) ;


const User = mongoose.model('User', userSchema) ;

module.exports = {
    User : User,
}