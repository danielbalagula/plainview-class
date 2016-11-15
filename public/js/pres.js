$(document).ready(function(){

	var startedSlideShow = false;

	var x = document.getElementsByClassName("convoslides");
    for (i = 1; i < x.length; i++) {
      x[i].style.display = "none"; 
    }

	$(document).on('scroll', function() {
	    if($(this).scrollTop()>=$('#features').position().top-300){
	        if (startedSlideShow === false){
	        	var slideIndex = 0;
				carousel();
				startedSlideShow = true;

				function carousel() {
				    var i;
				    var x = document.getElementsByClassName("convoslides");
				    for (i = 0; i < x.length; i++) {
				      x[i].style.display = "none"; 
				    }
				    slideIndex++;
				    if (slideIndex > x.length) {slideIndex = 1} 
				    x[slideIndex-1].style.display = "block"; 
				    setTimeout(carousel, 1250); // Change image every 2 seconds
				}
	        }
	    }
	})
})