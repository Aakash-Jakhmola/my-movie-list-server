require('dotenv').config() ;
const express = require('express') ;
const mongoose = require('mongoose') ;
const mongodb = require('mongodb');
var corsOptions = {
    origin:"http://localhost:3000",
    credentials: true };
const cors = require('cors') ;
const cookieParser = require('cookie-parser')
const app = express() ;

app.use(cookieParser());
app.use(express.json()) ;
app.use(cors(corsOptions));


const cc = mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:true}) ;
mongoose.set('useCreateIndex',true) ;
const con = mongoose.connection

con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', ()=> {
  console.log("Connected to mongodb")
});

const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const movieRouter = require('./routes/movies') ;

const userMovieApiRouter = require('./api/v2/user-movie-api');
const userFeedApiRouter = require('./api/v2/user-feed-api');
const userProfileRouter = require('./api/v2/user-profile-api');

app.use('/users',userRouter);
app.use('/posts',postRouter) ;
app.use('/movies',movieRouter) ;
app.use('/api/v2', userMovieApiRouter);
app.use('/api/v2/users', userFeedApiRouter);
app.use('/api/v2/profile', userProfileRouter);

let port = process.env.PORT || 8000;
app.listen(port, () => console.log('server started')) ;

module.exports = {
  cc,
}