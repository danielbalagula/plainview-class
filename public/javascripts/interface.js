var currentDiscussionId;
var localData;
var currentResponse;
var highlighted = false;
var g;
var responseFormat = "text";

$( document ).ready(function() {
	
	currentDiscussionId = $( ".discussionId" ).attr('id');
	
	drawGraph(currentDiscussionId);

	$('#testButton').click(function(e){
		console.log(responseFormat);
	})
	
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

	var matchedTitles = new Bloodhound({
	  	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
	  	queryTokenizer: Bloodhound.tokenizers.whitespace,
	  	remote: {
		    url: '../../responses/responseTitles/%QUERY',
		    wildcard: '%QUERY'
		  }
	});

	$('#suggestedTitles .typeahead').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
	}, {
	  name: 'matchedTitles',
	  source: matchedTitles,
	  highlight: true
	});

	var source   = $("#entry-template").html();
	var template = Handlebars.compile(source);
	var context = {title: "My New Post", body: "This is my first post!"};
	var html    = template(context);
	console.log(html);

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

    	var discussion = data.discussion;
    	var responses = data.responses;
    	var argumentsToRespondTo = [];

    	var strokeTypes = {
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
	    	$('#currentResponseText').text(currentResponse.text);
	    	$('#responseId').text(currentResponse._id);
	    	$("#responseUrl").attr("href", "http://localhost:3000/responses/id/"+currentResponse._id);
    	}

    	setCurrentResponse();

		g = new dagreD3.graphlib.Graph()
		  .setGraph({})
		  .setDefaultEdgeLabel(function() { return {}; });

    	responses.forEach(function(response){
    		if (discussion.citations.indexOf(response._id) !== -1){
    			g.setNode("n"+response._id, { id: "n"+response._id, label: wordwrap(response.text), class: "unselected-node citationResponse"});
    		} else {
    			g.setNode("n"+response._id, { id: "n"+response._id, label: wordwrap(response.text), class: "unselected-node citationResponse"});
    		}
    		discussion.relationships.slice(1,discussion.relationships.length).forEach(function(relationship){
    			if (relationship.hasOwnProperty(response._id)){
    				g.setEdge("n"+relationship[response._id]["relatedResponse"], "n"+response._id, {
    					style: "stroke: " + strokeTypes[relationship[response._id]["relationshipType"]] + "; fill: none;",
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

		var borderPath = svg.append("rect")
   			.attr("x", 0)
   			.attr("y", 0)
   			.attr("height", "800px")
   			.attr("width", "100%")
   			.style("stroke", "#D3D3D3")
   			.style("fill", "none")
   			.style("stroke-width", 2);

		var zoom = d3.behavior.zoom().on("zoom", function() {
		      inner.attr("transform", "translate(" + d3.event.translate + ")" +
		            "scale(" + d3.event.scale + ")")
		    });
		svg.call(zoom);

		d3.select("svg").on("dblclick.zoom", null);

		var render = new dagreD3.render();

		render(d3.select("svg g"), g);

		svg.selectAll(".node").on('mousedown', function(){
			if (mouseMovement){
				textSelected = true;
				mouseMovement = false;
			}
			d3.event.stopPropagation();
			nodeClicked = true;
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

		// var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
		// svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
		
    });
}

function wordwrap( str, width, brk, cut ) {
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;

    if (!str) { return str; }

    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
     return str.match( RegExp(regex, 'g') ).join( brk );
}