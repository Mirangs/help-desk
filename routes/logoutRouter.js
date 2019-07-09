const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('logout');
  req.logout();
  res.redirect('/');
});

module.exports = router;