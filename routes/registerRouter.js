const express = require('express');
const router = express.Router();
const { getRoles, getDepartments, isUserExists, addUser, addUserRole } = require('../model/db');

const bcrypt = require('bcrypt');
const saltRounds = 10;


const departmentPromise = getDepartments().then(rows => departmentsList = rows);
const rolesPromise = getRoles().then(rows => rolesList = rows);

let departmentsList, rolesList;

router.get('/', (req, res) => {
  Promise.all([departmentPromise, rolesPromise]).then(() => {
    res.render('register/register', {
      title: 'Реєстрація нового користувача',
      styleLink: 'css/style.css',
      departmentsList,
      rolesList
    });
  });
});

router.post('/', (req, res) => {
  isUserExists(req.body.login)
    .then(isExists => {
      if (!isExists) {
        const pass = req.body.pass;
        let hashedPass;
        bcrypt.hash(pass, saltRounds, (err, pass) => {
          if (err) return console.error(err);
          hashedPass = pass;
          addUser({...req.body, pass: hashedPass})
            .then((userId) => {
              const postId = req.body.post;
              return addUserRole(userId, postId)
            })
            .then(res.redirect('/'))
            .catch(err => {
              res.status(500).send(err);
              console.error(err);
            });
        });
      } else {
        res.render('register/register', {
          title: 'Реєстрація нового користувача',
          styleLink: 'css/style.css',
          departmentsList,
          rolesList,
          error: 'Користувач з таким логіном вже існує'
        });
      }
  })
  .catch(err => console.error(err));
});

module.exports = router;
