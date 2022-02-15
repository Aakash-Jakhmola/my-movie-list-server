const constants = require('../core/constants')

class Movie {
    //movie data is json object of movie detail recieved from tmdb api call
    constructor(movieData) {
        this.id = movieData.id
        this.title = movieData.title
        this.overview = movieData.overview
        this.release_date = movieData.release_date
        this.genres = movieData.genres?movieData.genres.map((genre)=>{return genre.name}):[]
        this.runtime = movieData.runtime
        this.vote_average = movieData.vote_average
        this.adult = movieData.adult
        this.language = movieData.original_language
        this.poster_url = movieData.poster_path?"https://image.tmdb.org/t/p/w400"+movieData.poster_path:''
        if(movieData.genre_ids) {
            movieData.genre_ids.forEach((genre_id)=>{
                this.genres.push(constants.GenreMap.get(genre_id))
            })
        }
    }
}

module.exports = {
    Movie: Movie,
}


