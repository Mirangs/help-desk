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
  isUserExists(req.body.login).then(isExists => {
    if (!isExists) {
      const pass = req.body.pass;
      let hashedPass;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) console.error(err);
        bcrypt.hash(pass, salt, (err, pass) => {
          if (err) console.error(err);
          hashedPass = pass;
          addUser({...req.body, pass: hashedPass})
            .then((userId) => {
              const postId = req.body.post;
              addUserRole(userId, postId);
            })
            .then(res.redirect('/'));
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
  }).catch(err => console.log(err));
});

module.exports = router;
