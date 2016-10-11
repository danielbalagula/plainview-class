var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:user_id', function(req, res, next) {
  res.send(req.params.user_id)
});

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/:user_id', function(req, res, next) {
  res.send(req.params.user_id)
});

router.delete('/:user_id', function(req, res, next) {
  res.send(req.params.user_id)
});

module.exports = router;
