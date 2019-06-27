const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index', {title: 'Вхід в систему'});
});

module.exports = router;