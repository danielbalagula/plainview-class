var currentDiscussionId;
var localData;
var currentResponse;

$( document ).ready(function() {
	currentDiscussionId = $( ".discussionId" ).attr('id');
	drawGraph(currentDiscussionId);
	$('#responseForm').submit(function(event){
		event.preventDefault();
		var newResponse = {
			discussionId: currentDiscussionId,
			 responseTitle: $("#newResponseTitle").val(),
			 responseText: $('#newResponseText').val(),
			 relatedResponse: currentResponse._id,
			 relationshipType: $("input:radio[name ='responseType']:checked").val()
			}
		$.ajax({
			type: "POST",
			url: "/responses",
			data: JSON.stringify(newResponse),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: location.reload()
		});
	});
});

function drawGraph(currentDiscussionId){

    d3.json('http://localhost:3000/api/discussions/id/' + currentDiscussionId, function(data){

    	var localData = data;

		function findResponseById(id){
			for (index in data.responses){
				if ("n"+data.responses[index]._id === id) { return data.responses[index] };
			}
		}

    	function setCurrentResponse(responseId){
    		var response;
    		if (responseId) { 
    			response = findResponseById(responseId); 
    		} else { 
    			response = data.responses[0]; 
    		}
    		currentResponse = response;
			$('#infoPanelHeading').text(currentResponse.title);
	    	$('#currentResponseText').text(currentResponse.text);
	    	$('#responseId').text(currentResponse._id);
	    	$("#responseUrl").attr("href", "http://localhost:3000/responses/id/"+currentResponse._id);
    	}

    	setCurrentResponse();

    	var mouseMovement;

    	var discussion = data.discussion;
    	var responses = data.responses;
    	var argumentsToRespondTo = [];

		var g = new dagreD3.graphlib.Graph()
		  .setGraph({})
		  .setDefaultEdgeLabel(function() { return {}; });

    	responses.forEach(function(response){
    		g.setNode("n"+response._id, { id: "n"+response._id, label: response.title + "\n" + wordwrap(response.text), class: "unselected-node "});
    		discussion.relationships.slice(1,discussion.relationships.length).forEach(function(relationship){
    			console.log(relationship);
    			if (relationship.hasOwnProperty(response._id)){
    				g.setEdge("n"+relationship[response._id]["relatedResponse"], "n"+response._id);
    			}
    		})
    	});

    	g.nodes().forEach(function(v) {
		  var node = g.node(v);
		  node.rx = node.ry = 7;
		});

		var svg = d3.select("svg"),
			inner = svg.select("g");
			svgGroup = svg.append("g");

		var borderPath = svg.append("rect")
   			.attr("x", 0)
   			.attr("y", 0)
   			.attr("height", "800px")
   			.attr("width", "100%")
   			.style("stroke", "#89bdd3")
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
		})

		svg.selectAll(".node").on('mousemove', function(){
			mouseMovement = true;
		})

		svg.selectAll(".node").on("click", function(id) {
			if (d3.event.defaultPrevented) return;
			var index = argumentsToRespondTo.indexOf(id);
			if (mouseMovement) return; 
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

