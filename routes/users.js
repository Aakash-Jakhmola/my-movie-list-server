const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const followfunc = require('../core/followfunctions');
const bcrypt = require('bcryptjs');
const getMovieList = require('../core/getMovieList')
const mongoose = require('mongoose');


router.post("/register", function (req, res) {
    res.contentType('application/json')

    const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    })

    if (newUser.password == null || newUser.password == undefined || newUser.password == "") {
        res.json({ error: "password must not be blank" })
        return;
    }

    bcrypt.genSalt(12, (err, salt) => {
        if (err) {
            res.status(500);
            return;
        }
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // Save user
            newUser.save()
                .then((result) => {
                    res.status(201)
                    res.json(result)
                    console.log(result)
                }
                )
                .catch((err) => res.json({ error: err.message }));
        })
    }
    );
});

router.post("/login", function (req, res) {

    User.findOne({ username: req.body.username }, function (err, foundUser) {
        if (err)
            res.send({ error: err });
        else {
            if (!foundUser) {
                res.send({ error: "Invalid Username" });
            } else {
                bcrypt.compare(req.body.password, foundUser.password).then((isMatch) => {
                    if (!isMatch) {
                        res.send({ error: "Wrong password !" });
                    } else {
                        res.send({
                            username: foundUser.username,
                            userid: foundUser._id,
                            following_count: foundUser.following.length,
                            followers_count: foundUser.followers.length,
                            movies_count: foundUser.movies.length,
                            firstname: foundUser.firstname,
                            lastname: foundUser.lastname

                        });
                    } // sends userId
                })
            }
        }
    })
});


router.get('/:username', async (req, res) => {
    res.contentType('application/json')
    const username = req.params.username

    User.aggregate([
        { $match: { username: username } },
        {
            $project: {
                username: 1,
                firstname: 1,
                lastname: 1,
                movies_count: { $size: '$movies' },
                followers_count: { $size: '$followers' },
                following_count: { $size: '$following' },
            }
        }
    ])
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.json({ error: err.message })
        })

})




router.get('/:username/movielist', async (req, res) => {
    console.time('task1')
    res.contentType('application/json')

    const username = req.params.username;
    const orderby = req.query.orderby || 'time';
    const offset = parseInt(req.query.offset) || 0;

    if (orderby == 'rating') {
        User.findOne({ username: username }, {
            "id": 1,
            "movies_by_rating": { $slice: [offset, offset + 10] }
        }, async (err, doc) => {
            if (doc) {
                try {
                    let result = await getMovieList(err, doc, orderby)
                    res.send(result)
                } catch (err) {
                    res.send(err)
                }
            } else {
                res.send([])
            }
        })
    } else {
        User.findOne({ username: username }, {
            "id": 1,
            "movies": { $slice: [offset, offset + 10] }
        }, async (err, doc) => {
            if (doc) {
                try {
                    let result = await getMovieList(err, doc, orderby)
                    res.send(result)
                } catch (err) {
                    res.send(err)
                }
            } else {
                res.send([])
            }
        })
    }

    // orderby time remaining

})

router.post('/addmovie', async (req, res) => {
    const userID = req.body.userid
    const movieID = parseInt(req.body.movieid);
    const rating = parseInt(req.body.rating);
    const review = req.body.review;

    console.log(userID)

    const obj = { movieid: movieID, rating: rating, review: review }

    try {

        let userExists = await User.countDocuments({ _id: userID })
        if (userExists == 0) {
            throw new Error("User does not exists")
        }

        //check if movie is already added 
        let currentMovieList = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(userID) } },
            { $project: { movies: 1 } }
        ])

        for (let i = 0; i < currentMovieList[0].movies.length; i++) {
            if (currentMovieList[0].movies[i].movieid == movieID) {
                throw new Error("Movie already watched")
            }
        }

        await User.findByIdAndUpdate(userID,
            {
                $push: {
                    movies: {
                        $each: [obj], $position: 0, movies_by_rating: {
                            $each: [obj],
                            $sort: { rating: -1 }
                        }
                    }
                }
            },
            { safe: true, upsert: true })

        res.status(201).end()
    } catch (err) {
        res.json({ error: err.message })
        return;
    }

});

router.post('/follow', async (req, res) => {

    const userId = req.body.userid;
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
            userid: friend._id,
            username: friendUsername,
            firstname: friend.firstname,
            lastname: friend.lastname
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
            res.json({ error: err.message })
        else {
            res.send(foundUser.followers);
        }
    })
})

router.get('/:username/following', (req, res) => {
    const username = req.params.username;
    User.findOne({ username: username }, { _id: 0, following: 1 }, (err, foundUser) => {
        console.log(foundUser)
        if (err)
            res.json({ error: err.message })
        else {
            res.send(foundUser.following);
        }
    })
})

router.delete('/:username/movielist', async (req, res) => {
    const username = req.params.username
    const movieid = req.query.movieid
    try {
        await User.findOneAndUpdate({ username: username }, {
                $pull: { movies: { movieid: { $eq: movieid } }, movies_by_rating: { movieid: { $eq: movieid } } }
        },
            { safe: true, upsert: true }
        )

        res.send({ msg: "ok" })
    } catch (err) {
        res.send({ error: err })
    }

})

router.patch('/:username/movielist', async (req, res) => {
    const username = req.params.username
    const movieid = parseInt(req.query.movieid)
    const obj = req.body.newMovieDetails
    const rating = parseInt(obj.rating)
    const review = obj.review


    console.log(obj)
    try {
        await User.updateOne(
            { "username": username, "movies.movieid": movieid, "movies_by_rating.movieid": movieid },
            { $set: { "movies.$.rating": rating, "movies.$.review": review, "movies_by_rating.$.rating": rating, "movies_by_rating.$.review": review } },
            { upsert: true }
        )
        res.send("ok")
    } catch (err) {
        console.log(err)
        res.send({ error: err })
    }

})

module.exports = router