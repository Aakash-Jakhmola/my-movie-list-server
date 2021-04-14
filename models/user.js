const mongoose = require('mongoose') ;

var ValidateEmail = function(email) {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email)
};


const userSchema = mongoose.Schema({
    firstname : String ,
    lastname : String,
    email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
    	required: 'Email address is required',
		// we can use either validate or match 
    	validate: [ValidateEmail, 'Please fill a valid email address'],
		//match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},
    moviesList : [new mongoose.Schema({
        movieId : Number, 
        rating : Number,
    },{ _id: false })],
    friendsList : [{
        userId : mongoose.Schema.Types.ObjectId
    }],
}) ;

const User = mongoose.model('user',userSchema) ;

module.exports = {
    User : User,
}