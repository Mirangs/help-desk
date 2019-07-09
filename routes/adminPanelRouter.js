const express = require('express');
const router = express.Router();
const { getRequests } = require('../model/db');
const { mustAuthenticated } = require('../middleware/passport');

router.get('/', mustAuthenticated, (req, res) => {
  getRequests().then(rows => {
    rows.forEach(row => {
      row.date = row.date.toLocaleDateString('uk-UA');
    });
    res.render('admin-panel/admin-panel', {
      title: 'Дошка заявок',
      styleLink: 'css/admin-panel.min.css',
      requestsList: rows,
      user: req.user
    });
  });
});

module.exports = router;
