var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../models/discussion');
var Response = require('../models/response');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('discussions', {});
});

router.get('/new', function(req, res, next) {
  res.render('new-discussion', {});
});

router.get('/id/:discussion_id([0-9a-f]{24})', function(req, res, next) {
	var discussionId = mongoose.Types.ObjectId(req.params.discussion_id.toString());
	Discussion.findById(discussionId, function (err, foundDiscussion) {
    var responses = {};
    Response.find({
      '_id': { $in: foundDiscussion.responses}
    }, function (err, foundResponses) { 
      res.render('discussion', {discussion: foundDiscussion, responses: foundResponses}); 
    })
	});
});

router.get('/:discussion_query', function(req, res, next) {
  var discussion_query = req.params.discussion_query;
	Discussion.findById(discussion_query, function (err, foundDiscussion) {
	  res.render('discussions', {discussion: foundDiscussion});
	});
});

router.post('/', function(req, res, next) {
  var newReponse = new Response({
    isLink: false,
    title: req.body.responseTitle,
    text: req.body.responseText,
    createdBy: 'Daniel'
  });

  newReponse.save(function(err, savedResponse){
      var newDiscussion = new Discussion({
        title: req.body.discussionTitle,
        tags: req.body.tags,
        public: req.body.visibility == 'public',
        createdBy: 'Daniel',
        responses: savedResponse.id
      });
      newDiscussion.save(function(err, savedDiscussion) {
       res.redirect('/discussions/id/' + savedDiscussion.id);
      });
  });
});

router.put('/id/:discussion_id([0-9a-f]{24})', function(req, res, next) {
  res.render('discussion', {});
});

router.delete('/id/:discussion_id', function(req, res, next) {
  
});

module.exports = router;

function validDiscussion(discussion){
  return true;
}
