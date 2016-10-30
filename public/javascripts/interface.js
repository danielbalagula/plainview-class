var currentDiscussionId;
var currentResponse;

var fetchedResponses = [];

var responseColors = {
	'subordinate': '#4286f4',
	'concur' : '#7af442',
	'dissnet' : '#1d00ff',
	'requestForClarification' : '#d8d147',
	'rejectPreviousArgumentType' : '#ef0000',
	'requestForFactualSubstantiation' : '#848484'
}

var highlighted = false; //checks if a current node is highlighted
var nodeClicked = false; //checks if a node was clicked
var replyClicked = false; //checks if the reply button was clicked
var argumentsToRespondTo = []; //an array of arguments the user is planning to respond to simultaneously

$( document ).ready(function() {
	
	var currentDiscussionId = $( ".discussionId" ).attr('id');

	var g = new dagreD3.graphlib.Graph()
		.setGraph({})
		.setDefaultEdgeLabel(function() { return {}; });

	var render = new dagreD3.render();

	var svg = d3.select("svg"),
		inner = d3.select("svg g"),
		zoom = d3.behavior.zoom().on("zoom", function() {
			inner.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		});
	svg.call(zoom).on("dblclick.zoom", null);

	fetchResponses();
	initializeGraph(currentDiscussionId ,svg, inner, render, g);
	startBloodhound();

});

function fetchResponses(searchQuery){
	$.ajax({
		type: "GET",
		url: "../../api/responses",
		data: searchQuery,
		success: function(data){
			fetchedResponses = data;
			loadResponseBrowser();
		}
	})
}

function loadResponseBrowser(){
	$("#responses").html(responseBrowser({responses: fetchedResponses}));
}

function useTitle(title){
	$('#responseModal').modal('hide');
	$('#newResponseTitle').val(title);
}

function citeResponse(id){
	$('#responseModal').modal('hide');
	// addNewNode($.grep(responses, function(e){ return e._id == id; });)
}

var mouseMovement;

function initializeGraph(id, svg, inner, render, g){
	d3.json('http://localhost:3000/api/discussions/id/' + id, function(data){
		responses = data.responses;
		discussion = data.discussion;
		responses.forEach(function(response){
			var relationshipType = discussion.relationships.filter(function(relationship){  return relationship[response._id] !== undefined })[0][response._id].relationshipType;
			if (discussion.citations.indexOf(response._id) !== -1){
				g.setNode("n"+response._id, { id: "n"+response._id, labelType: 'html', label: compiledResponseTemplate({templateData : {response: response, class: "citationResponse", responseTypeColor: responseColors[relationshipType]}}), class: "unselected-node citationResponse"});
			} else {
				response.text = response.text.replace(/(.{80})/g, "$1<br>")
				g.setNode("n"+response._id, { id: "n"+response._id, labelType: 'html', label: compiledResponseTemplate({templateData : {response: response, class: "originalResponse", responseTypeColor: responseColors[relationshipType]}}), class: "unselected-node"});
			}
			discussion.relationships.slice(1,discussion.relationships.length).forEach(function(relationship){
				if (relationship.hasOwnProperty(response._id)){
					g.setEdge("n"+relationship[response._id]["relatedResponse"], "n"+response._id, {
						style: "fill: none;",
						arrowhead: 'undirected',
						// lineInterpolate: 'basis'
					});
				}
			})
		});

		g.nodes().forEach(function(v) {
		  var node = g.node(v);
		  node.rx = node.ry = 1;
		});

		render(d3.select("svg g"), g);

		inner.selectAll(".node").on('mousedown', function(id){
			if (mouseMovement){
				textSelected = true;
				mouseMovement = false;
			}
			d3.event.stopPropagation();
			nodeClicked = true;
			if (replyClicked === true){
				g.node(id).label += "<div>" + inputTemplate + "</div>";
				render(d3.select("svg g"), g);
			 	replyClicked = false;
			}
		})

		svg.selectAll(".node").on('mousemove', function(){
			mouseMovement = true;
			if (nodeClicked === true){
				highlighted = true;
			}
		})

		$('.reply-button').on('mousedown', function(e){
			replyClicked = true;
		})		

		$('.reply-button').on('mouseup', function(e){
			replyClicked = false;
		})

		$('#responseBrowserSearchButton').click(function(e) {
			e.preventDefault();
			var searchQuery = {
				title: ($('#responseTitle').val()),
				text: ($('#responseKeywords').val())
			};
			fetchResponses(searchQuery);
		});
	});

}