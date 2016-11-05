$(document).ready(function(){
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})
	var jumboHeight = $('.jumbotron').outerHeight();
	function parallax(){
	    var scrolled = $(window).scrollTop();
	    $('.bg').css('height', (jumboHeight-scrolled) + 'px');
	}
	$('.bg').css("background-image", "url(/images/footer_lodyas.png)");
	parallax();

	$(window).scroll(function(e){
	    parallax();
	});
})
