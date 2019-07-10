const express = require('express');
const router = express.Router();
const { mustAuthenticated } = require('../middleware/passport');
const { getTasksByUser } = require('../model/db');

router.get('/', mustAuthenticated, (req, res) => {
  getTasksByUser(req.user.id)
    .then(tasks => {
      console.log(tasks);
      tasks.forEach(row => {
        row.date = row.date.toLocaleDateString('uk-UA');
      });
      return res.render('performer-desk/performer-desk', {
        title: 'Дошка виконавця',
        styleLink: 'css/admin-panel.min.css',
        tasksList: tasks,
        user: req.user
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

module.exports = router;