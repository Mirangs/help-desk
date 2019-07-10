const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.department_id === 1) {
      return res.redirect('/admin-panel');
    }
    if (req.user.department_id === 2) {
      return res.redirect('/performer-desk');
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
  (req, res) => {
    passport.authenticate('local', (err, user, message) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
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
          console.error(err);
          res.status(500).send(err);
        }
        if (user.department_id === 1) {
          return res.redirect('/admin-panel');
        }
        if (user.department_id === 5) {
          return res.redirect('/performer-desk');
        }
        return res.redirect('/user-desk');
      });
    })(req, res);
  }
);

module.exports = router;
