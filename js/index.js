$(function (){
	$('.flipCards').slick({
		centerMode: true,
		centerPadding: '24px',
		slidesToShow: 1,
		infinite: true,
		mobileFirst: true,
		arrows: false,
		responsive: [
		{
			breakpoint: 320,
			settings: {
				arrows: false,
				centerMode: true,
				// centerPadding: '24px',
				slidesToShow: 1
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 1024,
			settings: "unslick"
		}
		]
	});
});
