var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../models/discussion');
var Response = require('../models/response');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (res.apiQuery){
    res.json({});
  } else {
    res.render('responses', {});
  }
});

router.get('/new', function(req, res, next) {
  res.render('new-response', {});
});

router.get('/id/:response_id([0-9a-f]{24})', function(req, res, next) {
	console.log(typeof req.params.response_id)
	var responseId = mongoose.Types.ObjectId(req.params.response_id.toString());
	Response.findById(responseId, function (err, foundResponse) {
    if (req.apiQuery){
      res.json({responses: foundResponse});
    } else {
      res.render('response', {response: foundResponse});
    }
	});
});

router.get('/:response_query', function(req, res, next) {
	Response.find({title: req.params.response_query}, function (err, foundResponses) {
	  if (req.apiQuery){
      res.json({responses: foundResponses});
    } else {
      res.render('responses', {title: req.params.response_query, responses: foundResponses});
    }
	});
});

router.post('/', function(req, res, next) {
  var currentDiscussionId = req.body.discussionId;
  var newResponse = new Response({
    original_discussion: currentDiscussionId,
  	title: req.body.responseTitle,
  	text: req.body.responseText,
  	public: req.body.visibility == 'public'
  });
 
  newResponse.save(function(err, savedResponse){
    Discussion.findByIdAndUpdate(currentDiscussionId,
      {$push: {"responses": savedResponse.id }},
      {safe: true, upsert: true},
      function (err, foundDiscussion) {
        if (req.apiQuery){
          res.redirect('api/discussions/id/' + currentDiscussionId);
        } else {
          res.redirect('discussions/id/' + currentDiscussionId);
        }
      });
    });
});

router.put('/id/:response_id', function(req, res, next) {
  res.render('response', {});
});

router.delete('/id/:response_id', function(req, res, next) {
  
});

module.exports = router;

function validResponse(response){
	return true;
}
