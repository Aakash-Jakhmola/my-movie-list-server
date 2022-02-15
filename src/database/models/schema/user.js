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

    watchedMoviesCount: {
      type: Number,
      default: 0,
      required: true
    },

    watchLaterMoviesCount: {
      type: Number,
      default: 0,
      required: true
    },
    
    followersCount : {
      type: Number,
      default: 0,
      required: true
    },

    followingCount : {
      type: Number,
      default: 0,
      required: true
    },
    
});


_user.model = mongoose.model('User', _user.schema) ;

module.exports = _user;