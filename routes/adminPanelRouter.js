const express = require('express');
const router = express.Router();
const { getRequests, getUsersByRole } = require('../model/db');
const { mustAuthenticated } = require('../middleware/passport');

router.get('/', mustAuthenticated, (req, res) => {
  const requestsPromise = getRequests();
  const performersPromise = getUsersByRole(2);

  Promise.all([requestsPromise, performersPromise]).then(([ requests, performers ]) => {
    res.render('admin-panel/admin-panel', {
      title: 'Панель адміністратора',
      styleLink: 'css/admin-panel.min.css',
      requestsList: requests,
      user: req.user,
      performers
    });
  });
});

module.exports = router;
