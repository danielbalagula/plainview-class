$( document ).ready(function() {
	var currentDiscussionId = $( ".discussionId" ).attr('id');
	drawGraph(currentDiscussionId);
});

function drawGraph(currentDiscussionId){

    d3.json('http://localhost:3000/api/discussions/id/' + currentDiscussionId, function(discussion){

    	// var data = [];
    	// var svg = d3.select("#debateExperience").attr("width", "100%").attr("height", "100%");

		var g = new dagreD3.graphlib.Graph()
		  .setGraph({})
		  .setDefaultEdgeLabel(function() { return {}; });

    	discussion.responses.forEach(function(response){

    		g.setNode("1",  { label: wordwrap(response.text + response.text + response.text + response.text + response.text + response.text + response.text + response.text)});
    		g.setNode("2",  { label: response.text});
    		g.setNode(3,  { label: response.text});
    		g.setNode(4,  { label: response.text});

    	});

    	function wordwrap( str, width, brk, cut ) {
		    brk = brk || '\n';
		    width = width || 75;
		    cut = cut || false;

		    if (!str) { return str; }

		   var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');

		     return str.match( RegExp(regex, 'g') ).join( brk );
		}

    	g.setEdge("1", "2");

    	g.nodes().forEach(function(v) {
		  var node = g.node(v);
		  node.rx = node.ry = 5;
		});

		var svg = d3.select("svg"),
			inner = svg.select("g");
		    svgGroup = svg.append("g");


		var zoom = d3.behavior.zoom().on("zoom", function() {
		      inner.attr("transform", "translate(" + d3.event.translate + ")" +
		                                  "scale(" + d3.event.scale + ")");
		    });
		svg.call(zoom);

		var render = new dagreD3.render();

		render(d3.select("svg g"), g);

		var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
		svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    	

   //  	var elem = svg.selectAll("g myCircleText")
   //      	.data(data)

   //      var elemEnter = elem.enter()
		 //    .append("g")
		 //    .attr("transform", function(d){return "translate("+d.x+",80)"})

		 // var rectangle = elemEnter.append("rect")
		 //    .attr("height", function(d){return d.height} )
		 //    .attr("width", function(d){return d.width} )
		 //    .attr("fill", function(d){return d.fill} )
		 //    .attr("id",function(d){return d.id})
		 //    .attr("stroke","black")
		
    });

}

