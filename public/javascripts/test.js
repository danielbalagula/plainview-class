$( document ).ready(function() {
	var currentDiscussionId = $( ".discussionId" ).attr('id');
	drawGraph(currentDiscussionId);
});

function drawGraph(currentDiscussionId){

    d3.json('http://localhost:3000/api/discussions/id/' + currentDiscussionId, function(data){

    	var discussion = data.discussion;
    	var responses = data.responses;
    	var argumentsToRespondTo = [];

		var g = new dagreD3.graphlib.Graph()
		  .setGraph({})
		  .setDefaultEdgeLabel(function() { return {}; });

    	responses.forEach(function(response){
    		discussion.relationships.forEach(function(relationship){
    			if (relationship.hasOwnProperty(response._id)){
    				g.setNode("n"+response._id, { id: "n"+response._id, label: response.title + "\n" + wordwrap(response.text), class: relationship[response._id]["relationshipType"]});
    				console.log("n"+response._id);
    			}
    		})
    	});

    	g.nodes().forEach(function(v) {
		  var node = g.node(v);
		  node.rx = node.ry = 20;
		});

		var svg = d3.select("svg"),
			inner = svg.select("g");
			svgGroup = svg.append("g");

		var zoom = d3.behavior.zoom().on("zoom", function() {

		      inner.attr("transform", "translate(" + d3.event.translate + ")" +
		                                  "scale(" + d3.event.scale + ")")
		    });
		svg.call(zoom);

		var render = new dagreD3.render();

		render(d3.select("svg g"), g);

		svg.selectAll(".node").on("click", function(id) {
			var index = argumentsToRespondTo.indexOf(id);
			if (index === -1){
				argumentsToRespondTo.push(id);
				svg.select("#"+id).attr('fill', 'red');
			} else {
				argumentsToRespondTo.splice(index, 1);
				svg.select("#"+id).attr('fill', 'blue');
			}
		});


		console.log(d3.select('#test').on(".zoom", console.log("312")));

		// var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
		// svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
		
    });

 //    $(function(){
 //    $.extend($.fn.disableTextSelect = function() {
 //        return this.each(function(){
 //            if($.browser.mozilla){//Firefox
 //                $(this).css('MozUserSelect','text');
 //            }else if($.browser.msie){//IE
 //                $(this).bind('selectstart',function(){return true;});
 //            }else{//Opera, etc.
 //                $(this).mousedown(function(){return true;});
 //            }
 //        });
 //    });
	//     $('.noSelect').disableTextSelect();//No text selection on elements with a class of 'noSelect'
	// });

}

function wordwrap( str, width, brk, cut ) {
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;

    if (!str) { return str; }

    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
     return str.match( RegExp(regex, 'g') ).join( brk );
}

