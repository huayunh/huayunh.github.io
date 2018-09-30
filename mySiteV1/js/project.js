$(function (){

	var initialSideBarHeight = $('#left-column').offset().top;

	$(window).scroll(function() {
		$('#right-column').offset(
			{top: $(window).scrollTop() + initialSideBarHeight}
			);
		
	});
})
