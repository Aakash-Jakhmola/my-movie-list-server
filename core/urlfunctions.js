function GetMovieUrl(movieId) {
    const url = "https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+process.env.API_KEY
    return url
}

module.exports = {
    GetMovieUrl : GetMovieUrl
}