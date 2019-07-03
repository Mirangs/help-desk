const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index/index', {
    title: 'Вхід в систему',
    styleLink: 'css/style.css'
  });
});

router.post('/', (req, res) => {
  if (req.body.login === 'Admin') {
    res.redirect('/admin-panel');
  } else if (req.body.login === 'Client') {
    res.redirect('/user-desk');
  } else {
    res.redirect('performer-tasks');
  }
});

module.exports = router;
