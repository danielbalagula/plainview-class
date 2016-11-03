var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../models/discussion');
var Response = require('../models/response');
var responseTitle = require('../models/responseTitle');

router.post('/', function(req, res, next) {
  var currentDiscussionId = req.body.discussionId;
  var newResponse;
  newResponse = new Response({
      original_discussion: currentDiscussionId,
      title: req.body.responseTitle,
      text: req.body.responseText,
      created_by: 'Daniel',
    });
  newResponse.save(function(err, savedResponse){
    var relationship = {}
    relationship[savedResponse.id] = {relatedResponse: req.body.relatedResponse, relationshipType: req.body.relationshipType};
    Discussion.findByIdAndUpdate(currentDiscussionId,
      {$push: {"responses": savedResponse.id, "relationships": relationship }},
      {safe: true, upsert: true},
      function (err, foundDiscussion) {
        if (req.apiQuery){
          res.redirect('api/discussions/id/' + currentDiscussionId);
        } else {
          res.json(savedResponse);
        }
      });
    });
  responseTitle.find({title: req.body.responseTitle}, function(err, foundResponse, num){
    if (foundResponse.length === 0){
      var newResponseTitle = new responseTitle({
        title: req.body.responseTitle
      });
      newResponseTitle.save(function(err, savedResponse){})
    }
  })
});

router.get('/', function(req, res, next) {
    console.log("this works at all")
  var query = getRegexFields(req.query);
  Response.find(query, function(err, foundResponses){
    if (req.apiQuery){
      console.log(foundResponses);
      res.json(foundResponses);
    } else {
      res.render('responses', {responses: foundResponses});
    }
  })
});

router.get('/featured', function(req, res, next) {
  req.body.filters = req.body.filters || {};
  Response.find(req.body.filters, function(err, foundResponses){
    if (req.apiQuery){
      res.json(foundResponses);
    } else {
      res.render('responses', {responses: foundResponses});
    }
  })
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
    console.log(foundResponses);
	  if (req.apiQuery){
      res.json({responses: foundResponses});
    } else {
      res.render('responses', {title: req.params.response_query, responses: foundResponses});
    }
	});
});

router.get('/responseTitles/:response_query', function(req, res, next){
  responseTitle.find({ title : { "$regex": req.params.response_query, "$options": "i" } }, function(err, foundTitles){
    var titles = [];
    if (titles !=== undefined){
    	foundTitles.forEach(function(title){
     		titles.push(title.title);
   	})
    }
    console.log(titles);
    res.send(titles);
  })
})

router.put('/id/:response_id', function(req, res, next) {
  res.render('response', {});
});

router.delete('/id/:response_id', function(req, res, next) {
  
});

module.exports = router;

function validResponse(response){
	return true;
}

function getRegexFields(query){
    console.log("got here");
  for (var field in query) {
    if (query.hasOwnProperty(field)) {
        query[field] = new RegExp(query[field], 'i')
    }
  }
  return query
}
