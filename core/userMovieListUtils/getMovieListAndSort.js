const postfunc = require('../postfunctions')

var sortMovies = function (movielist, orderby) {
    if (orderby == 'rating') {
        movielist.sort((a, b) => {
            if (a.rating > b.rating) {
                return -1;
            } else if (a.rating < b.rating) {
                return 1;
            }
            return 0;
        })
        return;
    }

    movielist.sort((a, b) => {
        if (a.time > b.time) {
            return -1;
        } else if (a.time < b.time) {
            return 1;
        }
        return 0;
    })
}

async function FormList(element) {
  
  
    try {
        let movie = await postfunc.RenderMovie(element.movieid)
        return ({
            time: element._id.getTimestamp(),
            movieid: element.movieid,
            rating: element.rating,
            review: element.review,
            movie: movie
        });
    } catch(err) {
        return ({
            time: element._id.getTimestamp(),
            movieid: element.movieid,
            rating: element.rating,
            review: element.review,
            error: err.error
        })
    }
}

async function getMovieListAndSort(doc, orderby) {
    
    try{
        if(!doc)
            return[];
        if(doc.movies && doc.movies_by_rating)
            return [];
        let result = doc.movies
        let movielist = []
        if (orderby == 'rating') {
            result = doc.movies_by_rating
        }
        if (result.length === 0) {
            return {result : movielist}
        }
        
        for(let i = 0 ; i < result.length ; ++i) {
            try {
                let item = await FormList(result[i])
                movielist.push(item)
            } catch (err) {
                movielist.push({})
            }
        }
        
        console.log(movielist)
        await sortMovies(movielist,orderby)
        return {result : movielist}
    }
    catch(err) {
        return {error : err}
    }

}

module.exports = getMovieListAndSort