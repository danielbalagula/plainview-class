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

router.get('/samplediscussion', function(req, res, next){
  var sampleResponse1 = new Response({
    title: "Here's a message",
    text: "Click and drag to shift the discussion and use the scroll wheel to zoom. Try writing a few replies.",
    created_by: "Daniel",
  });
  var sampleResponse2 = new Response({
    title: "You can start a new discussion",
    text: "Click on the plus sign on the top right of the screen to start a new discussion. Share the link with a friend to discuss together live.",
    created_by: "Striped Rhino",
  });
  var sampleResponse3 = new Response({
    title: "Try replying by citing a response",
    text: "You can cite existing responses as a reply. Click reply, click the browse button, and cite a response.",
    created_by: "Striped Rhino",
  });
  var relationship1 = {};
  var relationship2 = {};
  var relationship3 = {};
  relationship1[sampleResponse1._id] = {relatedResponse: "", relationshipType: 'root'};
  relationship2[sampleResponse2._id] = {relatedResponse: sampleResponse1._id, relationshipType: 'dissent'};
  relationship3[sampleResponse3._id] = {relatedResponse: sampleResponse1._id, relationshipType: 'dissent'};
  var sampleDiscussion = new Discussion({
    responses: [sampleResponse1._id, sampleResponse2._id, sampleResponse3._id],
    citations: [],
    relationships: [relationship1, relationship2, relationship3]
  });
  res.json({discussion: sampleDiscussion, responses: [sampleResponse1, sampleResponse2, sampleResponse3]});
})

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
  var citation = JSON.parse(req.body.citation)
  var io = req.app.get('socketio');
  var relationship = {}
  relationship[citation._id] = {relatedResponse: req.body.relatedResponse, relationshipType: req.body.relationshipType};
  Discussion.findByIdAndUpdate(req.body.discussionId,
    {$push: {"responses": citation._id, "relationships": relationship, "citations": citation._id}},
    {safe: true, upsert: true},
    function (err, foundDiscussion) {
        if (discussionClients[req.body.discussionId] !== undefined){
            discussionClients[req.body.discussionId].forEach(function(clientId){
                io.to(clientId).emit('newCitationResponse', {discussionId: req.body.discussionId, citation: citation, relatedResponse: req.body.relatedResponse});
            })
        }
        res.send('OK')
    }
  );
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
