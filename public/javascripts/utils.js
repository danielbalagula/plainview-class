$(document).ready(function(){
	
	var clipboard = new Clipboard('.clipboardDropdown');

	$(function () {
		$('[data-toggle="tooltip"]').tooltip({
			show: { effect: "blind", duration: 800 }
		})
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
