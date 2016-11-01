var responseBrowserTemplate = `
<% _.each(responses, function(response){ %>
     <div class="thumbnail" id="<%= response._id %>">
      <div class="caption">
        <span class="pull-left"> <font size=3 color='grey'><i><a href="/responses/<%= response.title %>"><%= response.title %></a></i></font></span>
        </br>
        <div class="responseSampleThumbnail">
        	<div class="row">
        		<%= response.text %>
        	</div>
        	<div class="btn-toolbar btn-toolbar-sm pull-right">
        		<button class="btn btn-sm btn-primary use-title">Use Title</button>
        		<button class="btn btn-sm cite-response")">Cite Response</button>
        	</div>
        </div>
      </div>
     </div>
<% }); %>
      `
var responseBrowser = _.template(responseBrowserTemplate);

var responseTemplate = `
	<div>
		<div class="<%= templateData.class %>" id="<%= templateData.response._id %>" data-params=<%= templateData.jsonData %>>
			<span class ="control glyphicon glyphicon-pawn test" style="color:<%= templateData.responseTypeColor %>"></span>
			<span class="pull-right"><a href="../../responses/id/<%= templateData.response._id %>"><i><%= templateData.response._id %></i></a></span>
			<span> <%= templateData.response.created_by %></span>
			<h3 class="templateData.response.responseTitle"><a href="../../responses/<%= templateData.response.title %>""><%= templateData.response.title %></a></h3>
			<p class="templateData.response.responseText"><%= templateData.response.text %></p>
			<button type="button" class="btn btn-link btn-sm reply-button">Reply</button>
		</div>
		<div class="inputTemplate" style="display:none">
			<hr style="border: none; height:1px; background-color: black ">
			<form id="responseForm">
				<div id="newResponseTitleDiv" class="form-group row">
					<div id="suggestedTitles">
						Response title:
						<input class="typeahead form-control" style="width: 50%; display:inline-block;" type="text" data-toggle="popover" data-trigger="focus" data-content="Describe a specific position that you will defend." id="newResponseTitle" name="responseTitle">
						<button type="button" class="btn btn-outline-secondary btn-sm"  data-toggle="modal" data-target="#responseModal">Browse</button>
					</div>
				</div>
				<div class="form-group row">
					<textarea rows="10" style="width:90%; border:solid .33px gray; resize: none;"></textarea>
				</div>
				<div class="form-group row">
					<button type="button" id="test" class="btn btn-sm submit-reply-button">Submit</button>
				</div>
			</form>
		</div>
	</div>
`
var compiledResponseTemplate = _.template(responseTemplate);