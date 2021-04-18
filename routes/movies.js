const express = require('express') ;
const router = express.Router() ;

const postfunc = require('../core/postfunctions')

router.get('/:movieid',(req,res)=>{
    res.contentType('application/json')
    const movieId = req.params.movieid ;

    postfunc.RenderMovie(movieId)
    .then(result => {
        res.json(result) ;
    })
    .catch(err=>{
        res.json(err) ;
    });
    
}) ;

module.exports = router ;