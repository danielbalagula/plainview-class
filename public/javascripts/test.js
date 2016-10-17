$( document ).ready(function() {
	var currentDiscussionId = $( ".discussionId" ).attr('id');
	drawGraph(currentDiscussionId);
});

function drawGraph(currentDiscussionId){

    d3.json('http://localhost:3000/api/discussions/id/' + currentDiscussionId, function(data){

    	var discussion = data.discussion;
    	var responses = data.responses;

		var g = new dagreD3.graphlib.Graph()
		  .setGraph({})
		  .setDefaultEdgeLabel(function() { return {}; });

    	responses.forEach(function(response){
    		discussion.relationships.forEach(function(relationship){
    			if (relationship.hasOwnProperty(response._id)){
    				g.setNode(response.id, { label: wordwrap(response.text), class: relationship.relationshipType});
    			}
    		})
    	});

    	g.nodes().forEach(function(v) {
		  var node = g.node(v);
		  node.rx = node.ry = 5;
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

		//d3.select(".noSelect").attr()

		render(d3.select("svg g"), g);

		//console.log(d3.select('#test').on(".zoom", console.log("312")));

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

