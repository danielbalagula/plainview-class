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


var responseBrowserTemplate = `
<% _.each(responses, function(response){ %>
     <div class="thumbnail">
      <div class="caption">
        <span class="pull-left"> <font size=3 color='grey'><i><a href="/responses/<%= response.title %>"><%= response.title %></a></i></font></span>
        </br>
        <div class="responseSampleThumbnail">
        	<div class="row">
        		<%= response.text %>
        	</div>
        	<div class="btn-toolbar btn-toolbar-sm pull-right">
        		<button class="btn btn-sm btn-primary" onclick="useTitle('<%= response.title %>')">Use Title</button>
        		<button class="btn btn-sm" onclick="citeResponse('<%= response._id %>')">Cite Response</button>
        	</div>
        </div>
      </div>
    </div>
<% }); %>
      `
var responseBrowser = _.template(responseBrowserTemplate);

var responseTemplate = `
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
var compiledResponseTemplate = _.template(responseTemplate);

var inputTemplate = `
	<div class="inputTemplate">
		<hr style="border: none; height:1px; background-color: black ">
		<form id="responseForm">
			<div id="newResponseTitleDiv" class="form-group row">
				<div id="suggestedTitles">
					Response title:
					<input class="typeahead form-control" style="width: 50%; display:inline-block;" type="text" data-toggle="popover" data-trigger="focus" data-content="Describe a specific position that you will defend." id="newResponseTitle" name="responseTitle">
					<button type="button" class="btn btn-outline-secondary btn-sm" data-toggle="modal" data-target="#responseModal" onclick="loadResponseBrowser()">Browse</button>
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
	initializeGraph(svg, inner, render);
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
	addNewNode($.grep(responses, function(e){ return e._id == id; });)
}

var mouseMovement;

function initializeGraph(svg, inner, render){
	d3.json('http://localhost:3000/api/discussions/id/' + '580fc1852b1132746263b79f', function(data){
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