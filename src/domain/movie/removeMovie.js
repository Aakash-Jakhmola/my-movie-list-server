async function removeMovie() {
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
}

module.exports = removeMovie;