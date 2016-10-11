var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('tags', {});
});

router.get('/:tag', function(req, res, next) {
  res.render('tag', {});
});

module.exports = router;
