require('dotenv').config() ;

const express = require('express') ;
const https = require('https') ;
const mongoose = require('mongoose') ;
const {User} = require('./models/user') ;

const app = express() ;

const apiKey = process.env.API_KEY ;

app.set('view engine', 'ejs') ;
app.use(express.json()) ;
app.use(express.urlencoded());

mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true}) ;
const con = mongoose.connection

con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', ()=> {
  console.log("Connected to mongodb")
});

const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const movieRouter = require('./routes/movies') ;

app.use('/users',userRouter);
app.use('/posts',postRouter) ;
app.use('/movies',movieRouter) ;

//for testing ... will be removed
app.get('/',function(req,res){
    res.render("home", {data : []}) ;
});

//for testing ... will be removed
app.post('/', function(req, res){
    const movieName = req.body.movieName ;
    const url = 'https://api.themoviedb.org/3/search/movie?language=en-US&api_key='+apiKey+'&query=' + movieName ;
    https.get(url, (resp) => {
        let data = '';
      
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          let dataJson = JSON.parse(data)
          res.render('home', {data : dataJson.results}) ;
          
        });
      
      }).on("error", (err) => {
        res.json(err)
      });
    
}) ;

let port = process.env.PORT || 3000;

app.listen(port, () => console.log('server started')) ;