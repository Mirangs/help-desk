const express = require('express');
const router = express.Router();
const { mustAuthenticated } = require('../middleware/passport');
const { getTasksByUser, getRequestStatuses } = require('../model/db');

router.get('/', mustAuthenticated, (req, res) => {
  const requestStatusesPromise = getRequestStatuses();
  const tasksByUserPromise = getTasksByUser(req.user.id);

  Promise.all([requestStatusesPromise, tasksByUserPromise])
    .then(([ statuses, tasksList ]) => {
      return res.render('performer-desk/performer-desk', {
        title: 'Дошка виконавця',
        styleLink: 'css/admin-panel.min.css',
        tasksList,
        statuses,
        user: req.user
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

module.exports = router;