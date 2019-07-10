const express = require('express');
const router = express.Router();
const { getRequests, getUsersByRole, getRequestStatuses, updateIssue } = require('../model/db');
const { mustAuthenticated } = require('../middleware/passport');

router.get('/', mustAuthenticated, (req, res) => {
  const requestsPromise = getRequests();
  const performersPromise = getUsersByRole(5);
  const requestStatusesPromise = getRequestStatuses();
  
  Promise.all([requestsPromise, performersPromise, requestStatusesPromise]).then(([ requests, performers, statuses ]) => {
    res.render('admin-panel/admin-panel', {
      title: 'Панель адміністратора',
      styleLink: 'css/admin-panel.min.css',
      requestsList: requests,
      user: req.user,
      performers,
      statuses
    });
  });
});

router.post('/', mustAuthenticated, (req, res) => {
  updateIssue(req.body)
    .then(() => {
      res.json({
        id: req.body.id
      });
    })
});

module.exports = router;
