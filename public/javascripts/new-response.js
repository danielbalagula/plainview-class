$(document).ready(function(){
    $('[data-toggle="popover"]').popover(); 
});

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
