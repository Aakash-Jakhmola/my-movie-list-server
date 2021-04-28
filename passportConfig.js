const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");
const {User} = require('./models/user');


module.exports = passport => {



  passport.use(User.createStrategy());

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });



};





