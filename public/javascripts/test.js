$( document ).ready(function() {
	var currentDiscussionId = $( ".discussionId" ).attr('id');
	drawGraph(currentDiscussionId);
});

function drawGraph(currentDiscussionId){

	var width = 960, height = 500;

    d3.json('http://localhost:3000/api/discussions/id/' + currentDiscussionId, function(discussion){

    	var data = [];
    	var svg = d3.select("#debateExperience").attr("width", "100%").attr("height", "100%");
    	var x = 20;

    	discussion.responses.forEach(function(response){
    		
			var responseNode = svg.append("foreignObject").attr("x", 50).attr("y", 15).attr("width", 200).attr("id", "n"+response._id).attr("stroke", "black");
			var responseText =  responseNode.append("xhtml:div").attr("style", "id:t" + response._id + "; width:190px; height:auto; overflow-y:auto").text(response.text);
			var textHeight = responseNode[0][0].childNodes[0].clientHeight;
			responseNode.attr("height", textHeight + 10)
			svg.append("rect").attr("x",responseNode.attr("x")-10).attr("y",responseNode.attr("y")-10).attr("width",200).attr("height", textHeight+15).attr("fill","none").attr("stroke", "black")
			// console.log($("#t" + response._id));
			// console.log($("n"+response._id).css("height"))

    		data.push({"overflow-y": "auto","id": response._id , "fill": "white", "x": x, "width":80, "height":80, "label": response.text});
    		x += 100;
    	});
    	

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

