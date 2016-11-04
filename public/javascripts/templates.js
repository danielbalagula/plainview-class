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
			<span class ="control glyphicon glyphicon-pawn urlButton" style="color:<%= templateData.responseTypeColor %>"></span>
			<span class="pull-right">
				<span data-toggle="tooltip" title="Copy id to clipboard" style="cursor: pointer;" class ="urlButton control glyphicon glyphicon-link" data-clipboard-text="<%= templateData.response._id %>"></span>
			</span>
			<span> <%= templateData.response.created_by %></span>
			<h3 class="responseTitle"><a href="../../responses/<%= templateData.response.title %>""><%= templateData.response.title %></a></h3>
			<div class="responseText"><%= templateData.response.text %></div>
			<button type="button" class="btn btn-link btn-sm reply-button">Reply</button>
		</div>
		<div class="inputTemplate" style="display:none">
			<hr style="border: none; height:1px; background-color: black ">
			<form id="responseForm-<%= templateData.response._id %>">
				<div id="newResponseTitleDiv" class="form-group row">
					<div id="suggestedTitles">
						Response title:
						<input class="typeahead form-control" style="width: 50%; display:inline-block;" type="text" data-toggle="popover" data-trigger="focus" data-content="Describe a specific position that you will defend." id="newResponseTitle" name="title">
						<button type="button" class="btn btn-outline-secondary btn-sm"  data-toggle="modal" data-target="#responseModal">Browse</button>
					</div>
				</div>
				<div class="form-group row">
					<textarea name="text" rows="10" form="responseForm-<%= templateData.response._id %>" style="width:90%; border:solid .33px gray; resize: none;"></textarea>
				</div>
				<div class="form-group row">
					<button type="button" class="btn btn-sm submit-reply-button">Submit</button>
				</div>
			</form>
		</div>
	</div>
`
var compiledResponseTemplate = _.template(responseTemplate);