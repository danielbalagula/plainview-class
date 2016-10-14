var express = require('express');
var router = express.Router();

router.get('/**', function(req, res, next){
	req.apiQuery = true;
	console.log(req.path);
	next();
})

module.exports = router;