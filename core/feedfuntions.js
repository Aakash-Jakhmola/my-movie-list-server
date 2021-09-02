const mongoose = require('mongoose');
const { User } = require('../models/user');

async function AddPostToFollowersFeed(postId,userId) {
    /* Any better way?*/

    let followers = [] ;
    try {
        let result = await User.find({following : {$all :{userid : userId}}}) ;
        result.forEach(user=>{followers.push(user._id)}) ;
    }catch(err) {
        console.log(err) ;
        return ;
    }
    //console.log(followers)

    followers.forEach(followerID => {
        User.findByIdAndUpdate(followerID,
            {$push: {feed: {postid: postId}}},
            {safe: true, upsert: true})
            .then(result =>{
                //console.log(result)
            })
            .catch(err=>{
                console.log(err)
            });
    }) ;

}

module.exports = {
    AddPostToFollowersFeed : AddPostToFollowersFeed
}