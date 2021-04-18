const mongoose = require('mongoose');
const https = require('https');
const {Movie, Post} = require('./objects');

const urlfunc = require('./urlfunctions');
const { User } = require('../models/user');

//id is string which is conveted to valid mongodb.ObjecID
function GenerateTimestampFromID(id) {
    const objectId = mongoose.Types.ObjectId(id)
    return objectId.getTimestamp()
}

function RenderMovie(movieId) {

  return new Promise((resolve,reject)=>{

    https.get(urlfunc.GetMovieUrl(movieId), (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          let movie = new Movie(JSON.parse(data))
          //console.log(movie)
          resolve(movie);
        });
      
      }).on("error", (err) => {
        reject({error:err.message})
      });
    
  }); 
}

//this function renders Post object which contains all details from Post models and converts to json form
async function RenderPost(postModel) {

    return new Promise((resolve,reject)=>{

        RenderMovie(postModel.movieid)
        .then(movie=>{
              const timeStamp = postModel._id.getTimestamp()
              const post = new Post(timeStamp,movie,postModel)
              resolve(post) ;
        })
        .catch(err=> {
          reject({error:err.message}) ;
        })
        
    });
}

function AppendPost(userId,postId) {

  User.findByIdAndUpdate(userId,
    {$push: {posts: {postid: postId}}},
    {safe: true, upsert: true})
    .then((result) =>{
       //console.log('result: ',result)
    })
    .catch(err=>{
        console.log(err);
    });
}

module.exports = {
    RenderMovie : RenderMovie,
    RenderPost : RenderPost,
    AppendPost : AppendPost
}