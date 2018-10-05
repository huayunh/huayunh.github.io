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
				slidesToShow: 1
			}
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 912,
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

// https://stackoverflow.com/a/39295206
function mailMe() {
	var firstHalf = "h" + window.location.hostname.slice(0,6) + "0828";
	var secondHalf = "@gmail.com";
	var email = firstHalf + secondHalf;
	var textArea = document.createElement("textarea");
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;  
	textArea.style.width = '2em';
	textArea.style.height = '2em'; 
	textArea.style.padding = 0;  
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';   
	textArea.style.background = 'transparent';
	textArea.contentEditable = true;
	textArea.readOnly = false;
	textArea.value = email;
	textArea.id = 'ta';
	document.body.appendChild(textArea);
	//textArea.select();
	var range = document.createRange();
	range.selectNode(textArea);
	textArea.select();
	try {
		var successful = document.execCommand('copy');
	} catch (err) {
		 alert('Oops, unable to copy');
	}
	document.body.removeChild(textArea);
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = "Copied: <br />" + firstHalf + "<br />" + secondHalf;
}

function outFunc() {
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = "Copy to clipboard";
}
