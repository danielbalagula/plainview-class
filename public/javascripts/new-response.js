$(document).ready(function(){
    $('[data-toggle="popover"]').popover(); 
});

$("#button").click(function(){
    alert( "Handler for .click() called." );
})

$(document).ready(function () {

    $('#newDiscussionForm').validate({ // initialize the plugin
        rules: {
            discussionTitle: {
                required: true,
                minlength: 5
            },
            responseTitle: {
                required: true,
                minlength: 5
            },
            responseText: {
                required: true,
                minlength: 30
            }
        }
    });

});
