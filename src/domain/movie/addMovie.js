async function addMovie() {
  await Movie.updateOne({"movie_id": movieObj.movie_id}, movieObj, {upsert:true});
}

module.exports = addMovie;