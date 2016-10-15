$( document ).ready(function() {
	var currentDiscussionId = $( ".discussionId" ).attr('id');
	$.get( "http://localhost:3000/api/discussions/id/" + currentDiscussionId, function( data ) {
	  //alert( JSON.stringify(data) );
	});
	drawGraph();
});

function drawGraph(){
	var g = new dagreD3.graphlib.Graph()
	  .setGraph({})
	  .setDefaultEdgeLabel(function() { return {}; });

	// Automatically label each of the nodes
	states.forEach(function(state) { g.setNode(state, { label: state }); });

	// Set up the edges
	g.setNode(0,  { label: " TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP TOP",       class: "type-TOP" });
	g.setNode(1,  { label: "S",         class: "type-S" });
	g.setNode(2,  { label: "NP",        class: "type-NP" });
	g.setNode(3,  { label: "DT",        class: "type-DT" });
	g.setNode(4,  { label: "This",      class: "type-TK" });
	g.setNode(5,  { label: "VP",        class: "type-VP" });
	g.setNode(6,  { label: "VBZ",       class: "type-VBZ" });
	g.setNode(7,  { label: "is",        class: "type-TK" });
	g.setNode(8,  { label: "NP",        class: "type-NP" });
	g.setNode(9,  { label: "DT",        class: "type-DT" });
	g.setNode(10, { label: "an",        class: "type-TK" });
	g.setNode(11, { label: "NN",        class: "type-NN" });
	g.setNode(12, { label: "example",   class: "type-TK" });
	g.setNode(13, { label: ".",         class: "type-." });
	g.setNode(14, { label: "sentence",  class: "type-TK" });

	g.setEdge(3, 4);
	g.setEdge(2, 3);
	g.setEdge(1, 2);
	g.setEdge(6, 7);
	g.setEdge(5, 6);
	g.setEdge(9, 10);
	g.setEdge(8, 9);
	g.setEdge(11,12);
	g.setEdge(8, 11);
	g.setEdge(5, 8);
	g.setEdge(1, 5);
	g.setEdge(13,14);
	g.setEdge(1, 13);
	g.setEdge(0, 1)

	// Set some general styles
	g.nodes().forEach(function(v) {
	  var node = g.node(v);
	  node.rx = node.ry = 5;
	});

	// Add some custom colors based on state
	g.node('CLOSED').style = "fill: #f77";
	g.node('ESTAB').style = "fill: #7f7";

	var svg = d3.select("svg"),
	    inner = svg.select("g");

	// Set up zoom support
	var zoom = d3.behavior.zoom().on("zoom", function() {
	      inner.attr("transform", "translate(" + d3.event.translate + ")" +
	                                  "scale(" + d3.event.scale + ")");
	    });
	svg.call(zoom);

	// Create the renderer
	var render = new dagreD3.render();

	// Run the renderer. This is what draws the final graph.
	render(inner, g);

	// Center the graph
	var initialScale = 0.75;
	zoom
	  .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
	  .scale(initialScale)
	  .event(svg);
	svg.attr('height', g.graph().height * initialScale + 40);
}

function addTextLabel(root, node) {
  var domNode = root.append("text");

  var lines = processEscapeSequences(node.label).split("\n");
  for (var i = 0; i < lines.length; i++) {
    domNode
      .append("tspan")
        .attr("xml:space", "preserve")
        .attr("dy", "1em")
        .attr("x", "1")
        .text(lines[i]);
  }

  util.applyStyle(domNode, node.labelStyle);

  return domNode;
}

function processEscapeSequences(text) {
  var newText = "",
      escaped = false,
      ch;
  for (var i = 0; i < text.length; ++i) {
    ch = text[i];
    if (escaped) {
      switch(ch) {
        case "n": newText += "\n"; break;
        default: newText += ch;
      }
      escaped = false;
    } else if (ch === "\\") {
      escaped = true;
    } else {
      newText += ch;
    }
  }
  return newText;
}