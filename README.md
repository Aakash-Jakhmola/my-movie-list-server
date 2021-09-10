# my-movies-listiaa

### Frontend Repo : https://github.com/Aakash-Jakhmola/mml-client
### Deployed App : https://my-movie-list-react.netlify.app
**My Movie Listiaa** is a project which aims at creating application which enables friends to share and recommend movies and series with each other.
We use [TheMovieDB](https://www.themoviedb.org) Databse for movies and TV shows.

This repository is backend for **My Movie Listiaa**, written in Nodejs.

## How to Run?

 - Clone the repository using command `git clone https://github.com/Aakash-Jakhmola/my-movies-listiaa.git`
 - Install node and npm.
 - Run command `npm install` in the root.
 - Create `.env` file in root and give the following contents
    ```
    DB_URI=<Your db uri>  
    API_KEY=<Your tmdb api key>  
    CLIENT_URL=<Url from where you will make requests>  
    JWT_SECRET=<any string>
     ``` 
 - Run command `node app.js`. 

## TODOS

This repository is still incomplete and requires following things to be done:\

- User authentication.

- Session management.

- Implement ***/users/:userid/recommendations*** route.

- Lots and losts of error handling.

- Lots and lots of debugging.

- Implementing countless features we cannot think of right now.

See [DOCS.md](DOCS.md) for documentation.
