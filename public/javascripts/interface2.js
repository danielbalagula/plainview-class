var responseTypeColors = {
	'subordinate': '#4286f4',
	'concur' : '#7af442',
	'dissent' : '#1d00ff',
	'requestForClarification' : '#d8d147',
	'rejectPreviousArgumentType' : '#ef0000',
	'requestForFactualSubstantiation' : '#848484'
}

var responseColors = {
	'citation': '#56f441',
	'original': '#4286f4'
}

var domIdPrefixes = {
	"title": "t",
	"text": "r",
	"node": "n"
}

var edgeStyles = {
	'subordinate': 'fill: none;stroke: #0084ff; stroke-width: 0.5px;',
	'concur' : 'fill: none;stroke: #0084ff; stroke-width: 0.5px;',
	'dissent' : 'fill: none;stroke: #0084ff; stroke-width: 0.5px;',
	'requestForClarification' : 'fill: none;stroke: #0084ff; stroke-width: 0.5px;',
	'rejectPreviousArgumentType' : 'fill: none;stroke: #0084ff; stroke-width: 0.5px;',
	'requestForFactualSubstantiation' : 'fill: none;stroke: #0084ff; stroke-width: 0.5px;'
}

var arrowheadTypes = {
	'subordinate': 'undirected',
	'concur' : 'undirected',
	'dissent' : 'undirected',
	'requestForClarification' : 'undirected',
	'rejectPreviousArgumentType' : 'undirected',
	'requestForFactualSubstantiation' : 'undirected'
}

function nodeData (response){
	this.id = response._id;
	this.title = response.title;
	this.text = response.text;
	this.createdBy = response.createdBy;
	this.replyTitle = null;
	this.replyText = null;
}

nodeData.prototype.getDomTitleId = function(){
	return domIdPrefixes['title'] + this.id;
}

nodeData.prototype.getDomTextId = function(){
	return domIdPrefixes['text'] + this.id;
}

nodeData.prototype.getNodeId = function(){
	return domIdPrefixes['node'] + this.id;
}

nodeData.prototype.getResponseId = function(){
	return this.id;
}

nodeData.prototype.setReplyText = function(text){
	this.replyText = text;
}

nodeData.prototype.setReplyTitle = function(title){
	this.replyTitle = title;
}

$(document).ready(function(){
	var g, svg, inner, zoom; //graphics variables
	var currentDiscussionId = ('.discussionId').attr('id'); //id of the current discussion
	var currentResponse; //most recently clicked response id
	var discussion, responses; //current discussion and responses in the discussion
	var fetchedResponses; //responses fetched for browsing through responses
	var nodeDataArray = {}; //array of all data inside graph nodes

	var socket = io(); //socketIO
	var clipboardIdLink = new Clipboard('.urlButton'); //initializes click-to-copy on id buttons
	clipboard.on('success', function(e) {
		notify("info", "Copied response id to clipboard!", "glyphicon glyphicon-link")
	});

	socket.emit('viewingDiscussion', currentDiscussionId); //tells server that a person has joined the discussion

	var g = new dagreD3.graphlib.Graph()
		.setGraph({}) //sets the current graph
	var svg = d3.select('svg'),
		inner = d3.select('svg g'),
		zoom = d3.behavior.zoom().on('zoom', function(){
			inner.attr('transform', 'translte(' + d3.event.translate + ')scale(' + d3.event.scale + ')');

		}); //sets graph infos
	svg.call(zoom).on('dbclick.zoom', null); //disabling zoom on double click
	
	startBloodhound(); fetchResponses(); //async calls before drawing the graph

	d3.json('../../api/discussions/id/' + currentDiscussionId, function(data){ //gets disucssion and responses through api call
		
		socket.on('newOriginalResponse', function(data){
			addNewNode(data.newResponse, data.relatedResponse, "originalResponse");
		});
		socket.on('newCitationResponse', function(data){
			addNewNode(data.citation, data.relatedResponse, "citationResponse");
		});

		responses = data.responses, discussion = data.discussion;
		responses.forEach(function(response){
			var currentResponse = new nodeData(response);
			nodeDataArray.push(currentResponse);

			var relationshipType = discussion.relationships.filter(function(relationship){  return relationship[currentResponse.getResponseId] !== undefined })[0][currentResponse.getResponseId].relationshipType;
		
			if (discussion.citations.indexOf(currentResponse) === -1){
				g.setNode(currentResponse.getNodeId(), { style: "stroke: " + responseColors['original'] + "; stroke-width: 0.5px", id: currentResponse.getNodeId(), labelType: 'html', label: compiledResponseTemplate({templateData : {displayed: "none", response: currentResponse, class: "citationResponse", responseTypeColor: 'black'}}), class: "unselected-node "});
			} else {
				g.setNode(currentResponse.getNodeId(), { style: "stroke: " + responseColors['citation'] + "; stroke-width: 0.5px", id: currentResponse.getNodeId(), labelType: 'html', label: compiledResponseTemplate({templateData : {displayed: "none", response: currentResponse, class: "originalResponse", responseTypeColor: 'black'}}), class: "unselected-node"});
			}
			
			discussion.relationships.slice(1, discussion.relationships.length).forEach(function(relationship){
				if (discussion.citations.hasOwnProperty(currentResponse.)){
					g.setEdge(nodeDataArray[relationship[currentResponse.getResponseId]['relatedResponse']].getNodeId(), currentResponse.getNodeId(), {
						style: edgeStyles[relationship[currentResponse.getResponseId]['responseType']],
						arrowhead: arrowheadTypes[relationship[currentResponse.getResponseId]['relatedResponse']]
					});
				}
			});
		});

		

	});

})