# my-movie-list-server

### Frontend Repo 
* https://github.com/Aakash-Jakhmola/mml-client [old]
* https://github.com/Aakash-Jakhmola/my-movie-list-client [new]
### Deployed App 
* https://my-movie-list-react.netlify.app [old]
* https://priceless-hamilton-eafe97.netlify.app/ [new]

<br/>

**My Movie List** is a project which enables friends to share and recommend movies and series with each other.
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

## Features

* User Authentication ( JWT )
* User can search for movies
* User can add movies to his/her lists - Watched & Watch Later List
  * In watched list, user can give his/her personal score and review of the movie
* User can share his/her list
* User can follow others users. 
* User can be followed by other users.
* User can see trending movies of the week.


## Project Structure 

```

config/
    All the configurations that are needed on server
src/
    domain/
        module/
            all bussiness logic realating to module and interacts with database
    
    database/
        models/
                Exposes all the Database Models
    utils/
        utiliites required
    interface/
        module/
            exposes api endpoints to outside world and gets data from domain
    app.js (express app)
    server.js
package.json
README.md
.gitignore
.eslintrc.js
.gitignore
```


See [DOCS.md](DOCS.md) for documentation.
