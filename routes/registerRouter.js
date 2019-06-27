const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('register', {title: 'Реєстрація нового користувача'});
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;