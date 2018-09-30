
// https://codepen.io/designcouch/pen/Atyop
$(document).ready(function(){
	$('#hamburger').click(function(){
		$(this).toggleClass('open');
		var lastPage = localStorage.lastPageVisited;
		var thisPage = window.location.href.split("/").pop();
		localStorage.lastPageVisited = thisPage;
		console.log(thisPage)
		if (thisPage  == "index.html") {
			window.location.href = lastPage;
		}
	});

	// when hovering on h1, it hides the diamond element behind. Use 
	// js to achieve the similiar effect.
	function diamondHover(){
		$(this).parent().find(">:first-child").toggleClass('onhover');
	}

	$('.diamond').hover(diamondHover);
	$('.diamond-text').hover(diamondHover);

	if (localStorage.lastPageVisited) {
		if (localStorage.lastPageVisited == "index.html") {
			// do nothing
		} else {
			$('#hamburger').css("opacity", "1");
		}
	}
});