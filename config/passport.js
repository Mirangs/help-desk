const LocalStrategy = require('passport-local').Strategy;
const { connection } = require('../model/db');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    connection.query(`SELECT * FROM user WHERE id = ${id}`, (err, rows) => {
      if (err) {
        done(err, null);
      }
      
      done(null, rows[0]);
    });
  });
  
  passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'pass',
  },
  (login, password, done) => {
    connection.query(`SELECT * FROM user WHERE login = '${login}'`, (err, rows) => {
      if (err) {
        return done(err);
      }
  
      if (!rows.length) {
        return done(null, false, { error: 'No user found' });
      }
  
      if (!(bcrypt.compareSync(password, rows[0].password))) {
        return done(null, false, { error: 'Email or password is invalid' });
      }

      return done(null, rows[0]);
    });
  }
  ));
};