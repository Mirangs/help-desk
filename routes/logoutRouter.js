const express = require('express');
const router = express.Router();
const { mustAuthenticated } = require('../middleware/passport');

router.get('/', mustAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;