const mongoose = require('mongoose')
const { User } = require('../models/User.model')

async function AppendFollowersList(userId,friendId) {

    const user = await User.findById(userId)
    const obj = { 
        userid: user._id,
        username : user.username,
        firstname : user.firstname,
        lastname : user.lastname
     };

    User.findByIdAndUpdate(friendId,
        {$push: {followers: obj}},
        {safe: true, upsert: true})
        .then(result =>{
            //console.log(result)
        })
        .catch(err=>{
            console.log(err)
        });
}

async function GetFollowersList(userId) {
 /*Any better way?*/
    return new Promise(async(resolve,reject)=>{
        let result;
        try {
            result = await User.find({following : {$all :{userid : userId}}}) ;
        }catch(err) {
            console.log(err) ;
            reject(err) ;
        }
        resolve(result) ;

    }) ;
}

async function GetFollowingList(userId) {
   
    return new Promise(async(resolve,reject)=>{
        let result;
        try {
            result = await User.find({followers : {$all :{userid : userId}}}) ;
        }catch(err) {
            console.log(err) ;
            reject(err) ;
        }
        resolve(result) ;
    }) ;
}

module.exports = {
    AppendFollowersList : AppendFollowersList,
    GetFollowersList : GetFollowersList,
    GetFollowingList : GetFollowingList
}