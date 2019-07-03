const express = require('express');
const router = express.Router();
const connect = require('../model/db');

router.get('/', (req, res) => {
  connect.query('SELECT * FROM request_view').spread(rows => {
    rows.forEach(row => {
      row.date = row.date.toLocaleDateString('uk-UA');
    });
    res.render('admin-panel/admin-panel', {
      title: 'Дошка заявок',
      styleLink: 'css/admin-panel.min.css',
      requestsList: rows
    });
  });
});

module.exports = router;
