var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('blocks', {});
});

router.get('/new', function(req, res, next) {
  res.render('new-block', {});
});

router.get('/:block_id', function(req, res, next) {
  res.render('block', {});
});

router.post('/', function(req, res, next) {
  res.redirect('/blocks/blockidhere')
});

router.put('/:block_id', function(req, res, next) {
  res.render('block', {});
});

router.delete('/:block_id', function(req, res, next) {
  
});

module.exports = router;
