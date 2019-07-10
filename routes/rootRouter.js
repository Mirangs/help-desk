const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.department_id === 1) {
      return res.redirect('/admin-panel');
    }
    if (req.user.department_id === 3) {
      return res.redirect('/user-desk');
    }
  }
  return res.render('index/index', {
    title: 'Вхід в систему',
    styleLink: 'css/style.css'
  });
});

router.post('/',
  (req, res, next) => {
    passport.authenticate('local', (err, user, message) => {
      if (err) {
        return res.send(err);
      }
      if (message) {
        return res.render('index/index', {
          title: 'Вхід в систему',
          styleLink: 'css/style.css',
          message: message.error
        });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        if (user.department_id === 1) {
          res.redirect('/admin-panel');
        }
        if (user.department_id === 3) {
          res.redirect('/user-desk');
        }
      });
    })(req, res, next);
  }
);

module.exports = router;
