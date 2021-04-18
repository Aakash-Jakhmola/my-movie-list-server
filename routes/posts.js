const express = require('express') ;
const router = express.Router() ;

const postfunc = require('../core/postfunctions') ;
const feedfunc = require('../core/feedfuntions') ;
const {Post} = require('../models/post.js') ;

router.post('/',(req,res) => {
    res.contentType('application/json') ;

    const post = new Post({
        userid : req.body.userid,
        movieid : req.body.movieid,
        movie_rating : req.body.rating,
        comment : req.body.comment
    })
    
    post.save()
    .then(result=>{
        //push post to user's posts list
        postfunc.AppendPost(result.userid,result._id) ;
        //add post to followers feed 
        feedfunc.AddPostToFollowersFeed(result._id, result.userid) ;
        res.json(result) ;
    })
    .catch(err=>{
        res.json(err) ;
    });

});

router.get('/:postid',async (req,res) => {
    res.contentType('application/json')
    const postid = req.params.postid
    
    try {
        const post = await Post.findById(postid)
        //console.log(post)
        postfunc.RenderPost(post)
            .then((result)=>{
                res.json(result)
            })
            .catch(err=>{
                res.json(err)
            })

    }catch(err) {
        res.json(err)
    }

});

module.exports = router
