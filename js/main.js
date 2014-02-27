	$(document).ready(function() {  
  		$('#myCarousel').hammer().on('swipeleft', function(){
  			$('#myCarousel').carousel('next'); 
  		})
  		$('#myCarousel').hammer().on('swiperight', function(){
  			$('#myCarousel').carousel('prev'); 
  		})

	
	}); 
