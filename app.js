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

app.use('/users',userRouter);

app.post('/', function(req, res){
    const movieName = req.body.movieName ;
    const url = 'https://api.themoviedb.org/3/search/movie?language=en-US&api_key='+apiKey+'&query=' + movieName ;
    https.get(url, (response) => {
        if(response.statusCode === 200) {
            console.log('Successfully retrieved the data');
           
        } else {
            console.log("Error " + response.statusCode) ;
        }
        response.on('data' , (data) => {
            console.log(JSON.parse(data));
            const dataJson = JSON.parse(data) ;
            res.render('home', {data : dataJson.results}) ;
        }) ;
    });
    
}) ;

let port = process.env.PORT || 3000;

app.listen(port, () => console.log('server started')) ;