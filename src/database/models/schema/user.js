const mongoose = require('mongoose') ;

const _user = {};

_user.schema = new mongoose.Schema({
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


_user.model = mongoose.model('User', _user.schema) ;

module.exports = _user;