var currentDiscussionId;
var localData;
var currentResponse;
var highlighted = false;
var responseFormat = "text";

var currentZoomScale;
var currentPosition;

var responseTempalte = `
	<div>
		<div class="<%= templateData.class %>">
			<span class ="control glyphicon glyphicon-pawn" style="color:<%= templateData.responseTypeColor %>"></span>
			<span class="pull-right"><a href="../../responses/id/<%= templateData.response._id %>"><i><%= templateData.response._id %></i></a></span>
			<span> <%= templateData.response.created_by %></span>
			<h3 class="templateData.response.responseTitle"><a href="../../responses/<%= templateData.response.title %>""><%= templateData.response.title %></a></h3>
			<p class="templateData.response.responseText"><%= templateData.response.text %></p>
			<button type="button" class="btn btn-link btn-sm reply-button">Reply</button>
		</div>
	</div>
`

var inputTemplate = `
	<div class="inputTemplate">
		<hr style="border: none; height:1px; background-color: black ">
		<ul class="tab">
		  <li><a href="javascript:void(0)" class="tablinks" onclick="openCity(event, 'London')">Text</a></li>
		  <li><a href="javascript:void(0)" class="tablinks" onclick="openCity(event, 'Paris')">Cite</a></li>
		</ul>
		<form id="responseForm">
			<div id="newResponseTitle" class="form-group row">
				<div id="suggestedTitles">
					Response title:
					<input class="typeahead form-control" style="width: 50%; display:inline-block;" type="text" data-toggle="popover" data-trigger="focus" data-content="Describe a specific position that you will defend." id="newResponseTitle" name="responseTitle">
					<button type="button" class="btn btn-outline-secondary btn-sm" data-toggle="modal" data-target="#responseModal">Browse</button>
				</div>
			</div>
			<div class="form-group row">
				<textarea rows="10" style="width:90%; border:solid .33px gray; resize: none;"></textarea>
			</div>
			<div class="form-group row">
				<button type="button" class="btn btn-sm reply-button">Submit</button>
			</div>
		</form>
	</div>
	`

var compiled = _.template(responseTempalte);

$( document ).ready(function() {

	$( document ).on( "mousemove", function( event ) {
		mouseY = event.pageY;
		mouseX = event.pageX;
	});

	startBloodhound();
	
	currentDiscussionId = $( ".discussionId" ).attr('id');
	
	drawGraph(currentDiscussionId);

	$('#responseForm').submit(function(event){
		event.preventDefault();
		if (responseFormat === "text"){
			var newResponse = {
				discussionId: currentDiscussionId,
				citation: false,
				responseTitle: $("#newResponseTitle").val(),
				responseText: $('#newResponseText').val(),
				relatedResponse: currentResponse._id,
				relationshipType: $("input:radio[name ='responseType']:checked").val()
			}
			addNodeToGraph($.ajax({
				type: "POST",
				url: "/responses",
				data: JSON.stringify(newResponse),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
			}), newResponse);
		} else if (responseFormat === "link"){
			var newResponse = {
				discussionId: currentDiscussionId,
				citation: true,
				citationId: $("#linkCitationId").val(),
				relatedResponse: currentResponse._id,
				relationshipType: $("input:radio[name ='responseType']:checked").val()
			}
			addNodeToGraph($.ajax({
				type: "POST",
				url: "/discussions/addCitationToDiscussion",
				data: JSON.stringify(newResponse),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
			}), newResponse);
		}
	});

	$("#formatTabs").on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
	    if (e.target.hash === "#linkTab"){
	    	responseFormat = "link";
	    } else if (e.target.hash === "#textTab"){
			responseFormat = "text";
	    }
	})

	// var source   = $("#entry-template").html();
	// var template = Handlebars.compile(source);
	// var context = {title: "My New Post", body: "This is my first post!"};
	// var html    = template(context);
	// console.log(html);
});

function addNodeToGraph(nodeId, newResponse){
	g.setNode("n"+nodeId, { id: "n"+nodeId, label: newResponse.responseTitle + "\n" + wordwrap(newResponse.responseText), class: "unselected-node "})	
}

function drawGraph(currentDiscussionId){

    d3.json('http://localhost:3000/api/discussions/id/' + currentDiscussionId, function(data){

    	var localData = data;

    	var mouseMovement;

    	var highlighted = false;
    	var nodeClicked = false;
    	var replyClicked = false;

    	var discussion = data.discussion;
    	var responses = data.responses;
    	var argumentsToRespondTo = [];

    	var responseColors = {
    		'subordinate': '#4286f4',
    		'concur' : '#7af442',
    		'dissnet' : '#1d00ff',
    		'requestForClarification' : '#d8d147',
    		'rejectPreviousArgumentType' : '#ef0000',
    		'requestForFactualSubstantiation' : '#848484'
    	}


		function findResponseById(id){
			for (index in data.responses){
				if ("n"+data.responses[index]._id === id) { return data.responses[index] };
			}
		}

    	function setCurrentResponse(responseId){
    		if (responseId) { 
    			currentResponse = findResponseById(responseId); 
    		} else { 
    			currentResponse = data.responses[0]; 
    		}
			$('#infoPanelHeading').text(currentResponse.title);
	    	$('#currentResponseText').text(currentResponse.text.replace(/<br>/g, ''));
	    	$('#responseId').text(currentResponse._id);
	    	$("#responseUrl").attr("href", "http://localhost:3000/responses/id/"+currentResponse._id);
    	}

    	setCurrentResponse();

		g = new dagreD3.graphlib.Graph()
		  .setGraph({})
		  .setDefaultEdgeLabel(function() { return {}; });

    	responses.forEach(function(response){
    		var relationshipType = discussion.relationships.filter(function(relationship){  return relationship[response._id] !== undefined })[0][response._id].relationshipType;
    		if (discussion.citations.indexOf(response._id) !== -1){
    			g.setNode("n"+response._id, { id: "n"+response._id, labelType: 'html', label: compiled({templateData : {response: response, class: "citationResponse", responseTypeColor: responseColors[relationshipType]}}), class: "unselected-node citationResponse"});
    		} else {
    			response.text = response.text.replace(/(.{80})/g, "$1<br>")
    			g.setNode("n"+response._id, { id: "n"+response._id, labelType: 'html', label: compiled({templateData : {response: response, class: "originalResponse", responseTypeColor: responseColors[relationshipType]}}), class: "unselected-node"});
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

		var svg = d3.select("svg"),
			inner = svg.select("g");
			svgGroup = svg.append("g");


		var render = new dagreD3.render();

		var svg = d3.select("svg"),
	    	inner = d3.select("svg g"),
	    	zoom = d3.behavior.zoom().on("zoom", function() {
				inner.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		   	});
		svg.call(zoom).on("dblclick.zoom", null);

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

		svg.selectAll(".node").on("click", function(id) {
			var index = argumentsToRespondTo.indexOf(id);
			if (mouseMovement) return; 
			if (highlighted === true){
				nodeClicked = false;
				highlighted = false;
				return;
			}
			if (index === -1){
				argumentsToRespondTo.push(id);
				svg.select(".selected-node").classed("selected-node", false);
				svg.select("#"+id).classed("selected-node", true);
				svg.select("#"+id).classed("unselected-node", false);
				setCurrentResponse(id);
			} else {
				argumentsToRespondTo.splice(index, 1);
				svg.select("#"+id).classed("selected-node", false);
				svg.select("#"+id).classed("unselected-node", true);
			}
		});

		$('.reply-button').on('mousedown', function(e){
			replyClicked = true;
		})		

		$('.reply-button').on('mouseup', function(e){
			replyClicked = false;
		})

		$('.testButton').click(function(e){
			console.log(nc);
		})


		// var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
		// svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
		
    });
}

function wordwrap( str, width, brk, cut ) {
    brk = brk || '5<br>';
    width = width || 20;
    cut = cut || false;

    if (!str) { return str; }

    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
     return str.match( RegExp(regex, 'g') ).join( brk );
}