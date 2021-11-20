const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const followfunc = require('../core/followfunctions');
const MovieUtils = require('../core/userMovieListUtils/index')
const UserUtils = require('../core/userUtils.js/index')
const AuthController = require('../core/authController')
const RequireAuth = require('../middleware/authMiddleware');
const { authenticateUser } = require('./../utils/auth')

const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try{
        let result = await UserUtils.SaveUser(req.body.username,req.body.password,req.body.firstname, req.body.lastname) 
        console.log(result)
        if(result.error)
            res.status(401)
        res.send(result)
    } catch(err) {
        res.send({error : err})
    }
});

router.post("/login", async (req, res) => {
    try {
        let result = await UserUtils.CheckCredentialsAndGetUser(req.body.username, req.body.password)
        if(result.error) {
            res.status(401).send(result.error) 
        } else {
        
            const token = AuthController.CreateToken(result.result)
            res.cookie('jwt',token,{maxAge:7*24*60*60*1000})
            //res.setHeader('Set-Cookie',[`username=${result.result.username}`,`user_id=${result.result._id}`]);`
            let data = await UserUtils.makeUser(result.result)
            res.send(data)
        }
    } catch(err) {
        res.send({error : err})
    }
});

router.post("/logout",(req,res)=>{
    //console.log('logging out')
    const token = 'somefaketoken'
    res.cookie('jwt',token,{httpOnly:true,maxAge:0})
    res.cookie('username',token,{httpOnly:true,maxAge:0})
    res.cookie('user_id',token,{httpOnly:true,maxAge:0})
    return res.status(200).send({msg:'logged out successfully'})
})

router.get('/loadUser',(req,res)=>{
    const token = req.cookies['jwt']
    if(!token) {
         return res.send({error:'Unauthorized'})
    } 
    try {
        let decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decodedToken)
        return res.status(200).send(decodedToken)
    } catch (err) {
        console.log(err)
        return res.status(401).send({error:"Unauthorized"})
    }
})

router.get('/isAuthenticated',RequireAuth,(req,res)=>{
    console.log('from here',req.cookies['jwt'])
    return res.status(200).send({msg:'Authenticated'})
})

router.get('/:username', async (req, res) => {
    try {
        let result = await UserUtils.getUserDetailsFromDb(req.params.username) ;
        console.log(result);
        result = await UserUtils.makeUser(result.result);
        console.log(result);
        if(result.error){
            res.status(401).send(result.error)
            return;
        }
        res.send(result)
    } catch(err) {
        res.send({error : err})
    }
})

router.get('/:username/movielist', async (req, res) => {
    const orderby = req.query.orderby || 'time';
    const offset = parseInt(req.query.offset) || 0;
    try {
        let result = await MovieUtils.getMovieList(req.params.username, orderby,offset)
        if(result.error)
            res.status(401).send(result.error)
        else 
            res.send(result.result)    
    } catch(err) {
        res.send(err)
    }
})

router.post('/addmovie',RequireAuth, async (req, res) => {
    if(!req.body.rating) {
        res.send({error:'please give rating'})
        return ;
    }
    let result = await MovieUtils.addMovieToList(req.body.userid,req.body.movieid,req.body.rating,req.body.review) 
    console.log(result)
    if(result.error)
        res.send({error:result.error})
    else res.send(result)

});

router.delete('/:username/movielist',RequireAuth, async (req, res) => {
    
    let result = await MovieUtils.deleteMovieFromList(req.params.username, req.query.movieid)
    if(result.err)
        res.status(401)
    res.send(result)
})

			
router.patch('/:username/movielist', async (req, res) => {
    const username = req.params.username
    const movieid = parseInt(req.query.movieid)
    const rating = parseInt(req.body.newrating)
    const review = req.body.newreview

    let result = await MovieUtils.updateMovieInList(username, movieid, rating, review) 
    if(result.error)
        res.status(401)
    res.send(result)

})

router.post('/follow',RequireAuth, async (req, res) => {

    const user = await authenticateUser(req.cookies.jwt) ;
    const userId = user.id;
    const friendUsername = req.body.username;

    try {
        const friend = await User.findOne({ username: friendUsername })
        if (friend == null || friend == undefined) {
            res.json({ error: "User does not exists" })
            return;
        }
        //check if user is trying to follow itself
        if (friend._id == userId) {
            throw new Error("You cannot follow yourself")
        }

        //check if user is already following this friend
        const currUser = await User.findById(userId);
        for (let i = 0; i < currUser.following.length; i++) {
            if (currUser.following[i].username == friendUsername) {
                throw new Error("Already following this person")
            }
        }

        const obj = {
            username: friendUsername, 
        };

        await User.findByIdAndUpdate(userId,
            { $push: { following: obj } },
            { safe: true, upsert: true })

        res.status(200).end();
        followfunc.AppendFollowersList(userId, friend.id)

    } catch (err) {
        res.json({ error: err.message })
        return
    }

});


router.get('/:username/followers', (req, res) => {
    const username = req.params.username;
    User.findOne({ username: username }, { _id: 0, followers: 1 }, (err, foundUser) => {
        if (err)
            res.json({ error: err.message }).status(401)
        else {
            res.send(foundUser.followers);
        }
    })
})

router.get('/:username/following', (req, res) => {
    const username = req.params.username;
    User.findOne({ username: username }, { _id: 0, following: 1 }, (err, foundUser) => {
        if (err)
            res.json({ error: err.message }).status(401).end()
        else {
            res.send(foundUser.following);
        }
    })
})

module.exports = router