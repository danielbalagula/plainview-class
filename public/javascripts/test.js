$( document ).ready(function() {
	var currentDiscussionId = $( ".discussionId" ).attr('id');
	$.get( "http://localhost:3000/api/discussions/id/" + currentDiscussionId, function( data ) {
		drawGraph(data);
	});
});

function drawGraph(data){

	var cy = cytoscape({
	  container: $('#cy'),

	  style: [ // the stylesheet for the graph
	    {
	      selector: 'node',
	      style: {
	        'label': 'data(id)',
		     'border-color': 'grey',
		     'border-width': 1,
		     'shape': 'rectangle',
		     'text-valign': 'center',
		     'text-wrap': 'wrap',
		     'text-max-width': 500
	      }
	    },

	    {
	      selector: 'edge',
	      style: {
	        'width': 3,
	        'line-color': '#ccc',
	        'target-arrow-color': '#ccc',
	        'target-arrow-shape': 'triangle'
	      }
	    }
	  ],

	  layout: {
	    name: 'grid',
	    rows: 43
	  },

	});

	cy.nodes().ungrabify()

	data.responses.forEach(function(response){
		cy.add([
	        {group: "nodes", data: {id: (response.title || "mislabeled") + "\n\n\n\n" + response.text }},
    	])
		console.log(response)
	})

}