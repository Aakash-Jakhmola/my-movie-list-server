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

app.get('/', function(req, res){
    res.render("home", {data : []}) ;
    const user1 = User({
        name : "aakash",
        email : "aakash001jakhmola@gmail.com",

    });
    user1.save().then(()=> {console.log('Successful');}) ;
}) ;

app.post('/', function(req, res){
    const movieName = req.body.movieName ;
    const url = 'https://api.themoviedb.org/3/search/movie?language=en-US&api_key='+apiKey+'&query=' + movieName ;
    https.get(url, (response) => {
        if(response.statusCode === 2000) {
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

let port = process.env.PORT ;
if(port == null)
    port = 3000 ;

app.listen(3000, () => console.log('server started')) ;