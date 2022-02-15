require('dotenv').config() ;
const express = require('express') ;
const mongoose = require('mongoose') ;
const cors = require('cors') ;
const cookieParser = require('cookie-parser')

const app = express() ;
app.use(express.json()) ;
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));


mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false}) ;

const con = mongoose.connection
con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', ()=> {
  console.log("Connected to mongodb")
});

const authRouter = require('./routes/auth.route');
// const userRouter = require('./routes/user.route');
// const movieRouter = require('./routes/movie.route');
// const followRouter = require('./routes/follow.route');
const watchRouter = require('./routes/watch.route');
// const followingRouter = require('./routes/following.route');

app.use('/auth', authRouter);
// app.use('/user', userRouter);
// app.use('/movie', movieRouter) ;
// app.use('/follow', followRouter);
// app.use('/following', followingRouter);
app.use('/watch', watchRouter);

let port = process.env.PORT || 8000;
app.listen(port, () => console.log('server started')) ;


/* 
things to do
- first get details in search movie, trending, 
- get details search user, get followers, getfollowing

*/