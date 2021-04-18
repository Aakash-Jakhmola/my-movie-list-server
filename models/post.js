const mongoose = require('mongoose') ;

const postSchema = new mongoose.Schema({
    userid : {
        type : String
    },
    movieid : {
        type : Number
    },
    movie_rating: {
        type: Number
    },
    comment : {
        type : String
    }
}) ;

const Post = mongoose.model('Post',postSchema) ;

module.exports = {
    Post : Post
}