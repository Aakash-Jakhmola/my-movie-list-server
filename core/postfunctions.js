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
          resolve(movie);
        });
      
      }).on("error", (err) => {
        //console.log("Error: " + err.message);
        reject({error:err.message})
      });
    
  }); 
}

function RenderSearchedMovies(movieName) {
  return new Promise((resolve,reject)=> {
    
    const url = 'https://api.themoviedb.org/3/search/movie?api_key='+ process.env.API_KEY +'&query=' + movieName ;
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          console.log("chunk", chunk);
          data += chunk;
        });
        resp.on('end', () => {
          let dataJson = JSON.parse(data)
          let list = []
          dataJson.results.forEach(element => {
              console.log(element)
              list.push(new Movie(element)) ;
              //console.log(element.genre_ids)
          });
          //console.log(dataJson.results)
          resolve(list)
        });
      
      }).on("error", (err) => {
        reject(err); 
      });

  });
}

//this function renders Post object which contains all details from Post models and converts to json form
//currently not funcitonal
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

//currently not funcitonal
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
    RenderSearchedMovies : RenderSearchedMovies,
    RenderPost : RenderPost,
    AppendPost : AppendPost
}