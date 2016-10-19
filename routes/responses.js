var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../models/discussion');
var Response = require('../models/response');

router.post('/', function(req, res, next) {
  var currentDiscussionId = req.body.discussionId;
  var newResponse;
  if (req.body.citation === "text"){
    newResponse = new Response({
        original_discussion: currentDiscussionId,
        title: req.body.responseTitle,
        text: req.body.responseText,
        citation: false
      })
  } else if (req.body.citation === "link"){
    newResponse = new Response({
        original_discussion: currentDiscussionId,
        citation: true,
        citationId: req.body.citationId
      })
  }
  console.log('321');
  newResponse.save(function(err, savedResponse){
    var relationship = {};
    relationship[savedResponse.id.toString()] = {relatedResponse: req.body.relatedResponse, relationshipType: req.body.responseType};
    var idForDebateExperience;
    if (req.body.citation === false){
      idForDebateExperience = savedResponse.id;
    } else if (req.body.citation === true) {
      idForDebateExperience = savedResponse.citationId;
    }
    console.log('123');
    Discussion.findByIdAndUpdate(currentDiscussionId,
      {$push: {"responses": idForDebateExperience, "relationships": relationship }},
      {safe: true, upsert: true},
      function (err, foundDiscussion) {
        if (req.apiQuery){
          res.redirect('api/discussions/id/' + currentDiscussionId);
        } else {
          res.send(savedResponse.id.toString());
        }
      });
    });
});

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

router.put('/id/:response_id', function(req, res, next) {
  res.render('response', {});
});

router.delete('/id/:response_id', function(req, res, next) {
  
});

module.exports = router;

function validResponse(response){
	return true;
}
