$(function (){
	$('.flipCards').slick({
		centerMode: true,
		centerPadding: '24px',
		slidesToShow: 1,
		infinite: true,
		mobileFirst: true,
		arrows: false,
		lazyLoad: 'ondemand',
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

	if ($(this).scrollTop() < 3) {
		$('nav').removeClass('shadow');
		$('nav').addClass('no-shadow');
	} else {
		$('nav').removeClass('no-shadow');
		$('nav').addClass('shadow');
	}

	$(window).scroll(() => {
		if ($(this).scrollTop() < 3) {
			$('nav').removeClass('shadow');
			$('nav').addClass('no-shadow');
		} else {
			$('nav').removeClass('no-shadow');
			$('nav').addClass('shadow');
		}
	});

	$('.flipCardContainer').click(function() {
		window.location.href = $(this).find('a').attr('href');
	});
});
