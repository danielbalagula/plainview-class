var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../models/discussion');
var Response = require('../models/response');


/* GET home page. */
router.get('/', function(req, res, next) {
  Response.find({}, function(err, result, count){
    res.send('/public/index.html')
  })
});

router.get('/demo', function(req, res, next){
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

	  sampleResponse1.save(function(err, savedres1){
	  	sampleResponse2.save(function(err, savedres2){
	  		sampleResponse3.save(function(err, savedres3){
	  			sampleDiscussion.save(function(err, savedDisc){
	  				res.redirect('/discussions/id/' + savedDisc._id);
	  			})
	  		})
	  	})
	  })
})

module.exports = router;
