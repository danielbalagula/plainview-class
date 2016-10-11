var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:response_id', function(req, res, next) {
  res.send(req.params.response_id)
});

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/:response_id', function(req, res, next) {
  res.send(req.params.response_id)
});

router.delete('/:response_id', function(req, res, next) {
  res.send(req.params.response_id)
});

module.exports = router;
