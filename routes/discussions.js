var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../models/discussion');
var Response = require('../models/response');
var responseTitle = require('../models/responseTitle');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (res.apiQuery){
    res.json({})
  } else {
    res.render('discussions', {});
  }
});

router.get('/new', function(req, res, next) {
  res.render('new-discussion', {});
});

router.get('/id/:discussion_id([0-9a-f]{24})', function(req, res, next) {
	var discussionId = mongoose.Types.ObjectId(req.params.discussion_id.toString());
	console.log("second time: " + discussionId);
	Discussion.findById(discussionId, function (err, foundDiscussion) {
    if (foundDiscussion) {
		Response.find({
        '_id': { $in: foundDiscussion.responses}
      }, function (err, foundResponses) {
        if (req.apiQuery){
          res.json({discussion: foundDiscussion, responses: foundResponses});
        } else {
          res.render('discussion', {discussionId: discussionId});
        }
      })
    }
	});	
});

router.post('/', function(req, res, next) {
  var newResponse = new Response({
    isLink: false,
    title: req.body.responseTitle,
    text: req.body.responseText,
    created_by: 'Daniel'
  });

  var relationship = {}
  relationship[newResponse._id.toString()] = {relatedResponse: "", relationshipType: "root"};

  var newDiscussion = new Discussion({
    title: req.body.discussionTitle,
    tags: req.body.tags,
    public: req.body.visibility == 'public',
    created_by: 'Daniel',
    responses: [newResponse._id],
    relationships: [relationship]
  });

  newResponse.original_discussion = newDiscussion._id;

  newResponse.save(function(err, savedResponse){
      newDiscussion.save(function(err, savedDiscussion) {
	      console.log(newDiscussion._id);
       res.redirect('/discussions/id/' + newDiscussion._id);
      });
  });
  responseTitle.find({title: req.body.responseTitle}, function(err, foundResponse, num){
    if (foundResponse !== undefined && foundResponse.length === 0){
      var newResponseTitle = new responseTitle({
        title: req.body.responseTitle
      });
      newResponseTitle.save(function(err, savedResponse){})
    }
  })
});

router.post('/addCitationToDiscussion', function(req, res, next){
  console.log(req.body);
  var relationship = {}
  relationship[req.body.citationId] = {relatedResponse: req.body.relatedResponse, relationshipType: req.body.relationshipType};
  Discussion.findByIdAndUpdate(req.body.discussionId,
    {$push: {"responses": req.body.citationId, "relationships": relationship, "citations": req.body.citationId}},
    {safe: true, upsert: true},
    function (err, foundDiscussion) {
        res.redirect('/discussions/id/' + req.body.discussionId);
    });
})

router.put('/id/:discussion_id([0-9a-f]{24})', function(req, res, next) {
  res.render('discussion', {});
});

router.delete('/id/:discussion_id', function(req, res, next) {
  
});

module.exports = router;

function validDiscussion(discussion){
  return true;
}
