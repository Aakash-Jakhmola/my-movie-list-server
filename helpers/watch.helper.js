const mongoose = require("mongoose");
const { User } = require("../models/User.model");
const { Watch } = require("../models/Watch.model");


const moviesCount = async(username, watchLater = false) => {
  let noOfMovies = 0 ;
  try {
    const result = await Watch.aggregate([ 
      { $match: {username: username, watch_later: watchLater}},
      { $count: "movies_count"}
    ]) ;
    if(result.length > 0) {
      noOfMovies = result[0].movies_count;
    }
  } catch(e) {
    throw new Error('counting failed');
  }
  return noOfMovies;
};

const updateMovieCount = async(username, list) => {
  const query = {};
  list.map((item) => {
    query[item.type] = item.amount;
  })
  await User.findOneAndUpdate( {username : username}, 
    { $inc : query }
  )
};


const addMovieToList = async(user, query, watchObj, list) => {
  const session = await mongoose.startSession();  
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };
  
  try {
    const transactionResults = await session.withTransaction(async () => {
      await Watch.updateMany(query, watchObj, {upsert: true, safe: true});
      await User.findOneAndUpdate({username: user.username}, { $inc : list }, {session} );
    }, transactionOptions);

    if (transactionResults) {
      console.log("The transaction was successfully created.");
    } else {
      console.log("The transaction was intentionally aborted.");
      throw new Error('Could not add due to internal error');
    }
  } catch(e) {
    throw new Error('Could not add due to internal error');
  }
  session.endSession();
};


const deleteMovieFromList = async(query) => {
  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };
  let list = {};
  if(query.watch_later) {
    list['watch_later_count'] = -1;
  } else {
    list['movies_count'] = -1;
  }
  try {
    const transactionResults = await session.withTransaction(async () => {
      const doc = await Watch.findOneAndDelete(query, {session});
      if(!doc) {
        throw new Error('not found');
      }
      const res = await User.findOneAndUpdate({username: query.username}, { $inc : list }, {session} );
      if(!res) {
        throw new Error('not found');
      }
    }, transactionOptions);

    if (transactionResults) {
      console.log("The transaction was successfully created.");
    } else {
      console.log("The transaction was intentionally aborted.");
      throw new Error('Could not remove due to internal error');
    }
  } catch(e) {
    console.log(e);
    throw new Error('Could not remove due to internal error');
  }
  session.endSession();
};

module.exports = {
  moviesCount,
  updateMovieCount,
  addMovieToList,
  deleteMovieFromList,
}