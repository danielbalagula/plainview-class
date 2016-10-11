var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {});
});

router.get('/:user_id', function(req, res, next) {
  res.render('profile', {});
});

router.post('/', function(req, res, next) {
  
});

router.put('/:user_id', function(req, res, next) {
  res.render('profile', {});
});

router.delete('/:user_id', function(req, res, next) {
  
});

module.exports = router;
