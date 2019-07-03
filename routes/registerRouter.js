const express = require('express');
const router = express.Router();
const connection = require('../model/db');

router.get('/', (req, res) => {
  let departmentsList, postsList;

  const departmentPromise = connection
    .query('SELECT * FROM department')
    .spread(rows => (departmentsList = rows));
  const postsPromise = connection
    .query('SELECT * FROM user_role')
    .spread(rows => (postsList = rows));

  Promise.all([departmentPromise, postsPromise]).then(() => {
    res.render('register/register', {
      title: 'Реєстрація нового користувача',
      styleLink: 'css/style.css',
      departmentsList,
      postsList
    });
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
