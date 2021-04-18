const mongoose = require('mongoose')
const { User } = require('../models/user')

async function AppendFollowersList(userId,followedId) {

    User.findByIdAndUpdate(followedId,
        {$push: {followers: {userid: userId}}},
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