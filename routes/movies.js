const express = require('express') ;
const router = express.Router() ;

const postfunc = require('../core/postfunctions')
const constants = require('../core/constants')

router.get('/genres',async(req,res)=>{
  res.json(Object.fromEntries(constants.GenreMap))
  
});

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

router.get('/search/:name',async(req,res)=>{
  res.contentType('application/json')
  
  postfunc.RenderSearchedMovies(req.params.name)
  .then((result)=>{
    res.json(result)
  })
  .catch((err)=>{
    res.json({error:err.message});
  })

});

module.exports = router ;