const express = require('express');
const router = express.Router();
const { mustAuthenticated } = require('../middleware/passport');
const { addIssue, getRequestsByLogin } = require('../model/db');

router.get('/', mustAuthenticated, (req, res) => {
  return res.render('user-desk/user-desk', {
    title: 'Дошка заявок',
    styleLink: 'css/style.css',
    user: req.user
  });
});

router.post('/', mustAuthenticated, (req, res) => {
  const issue = req.body;
  issue.date = new Date().toISOString().slice(0, 10);
  issue.critical = issue.critical === 'on' ? 1 : 0;
  issue.creator_id = req.user.id;
  issue.req_status_id = 4;
  issue.performer_id = null;
  addIssue(issue)
    .then(issueId => res.render('user-desk/user-desk', {
      title: 'Дошка заявок',
      styleLink: 'css/style.css',
      user: req.user,
      message: `Заявка ${issueId} успішно відправлена`
    }))
    .catch(err => console.error(err));
});

router.get('/:login/requests', mustAuthenticated, (req, res) => {
  getRequestsByLogin(req.user.login).then(requests => {
    return res.render('user-desk/requests', {
      title: 'Заяви',
      styleLink: '/css/admin-panel.min.css',
      login: req.user.login,
      tasksList: requests
    });
  });
});

module.exports = router;
