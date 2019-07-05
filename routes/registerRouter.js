const express = require('express');
const router = express.Router();
const { getRoles, getDepartments, isUserExists, addUser } = require('../model/db');

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
  console.log(req.body);
  isUserExists(req.body.login).then(isExists => {
    if (!isExists) {
      addUser(req.body).then(res.redirect('/'));
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
