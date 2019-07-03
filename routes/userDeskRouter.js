const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('user-desk/user-desk', {
    title: 'Дошка заявок',
    styleLink: 'css/style.css'
  });
});

module.exports = router;
