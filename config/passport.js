const LocalStrategy = require('passport-local').Strategy;
const { getUserByLogin, getUserById } = require('../model/db');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    getUserById(id)
      .then(user => done(null, user))
      .catch(err => {
        console.error(err);
        done(err, null);
      });
  });
  
  passport.use('local', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'pass',
  },
  (login, password, done) => {
    getUserByLogin(login)
      .then(user => {
        if (!user) {
          return done(null, false, { error: 'Користувач не знайдений' });
        }

        if (!(bcrypt.compareSync(password, user.password))) {
          return done(null, false, { error: 'Невірна почта або пароль' });
        }

        return done(null, user);
      })
      .catch(err => {
        console.error(err);
        done(err);
      });
  }
  ));
};