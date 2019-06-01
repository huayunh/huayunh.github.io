
// constants
const categories = [
'bricks',
]
const numberOfPicturesInTheCategory = 3;
const startingTime = new Date();

// parameters
var param = getUrlVars();
if (param) {

	if (param['random']) { var imageOrderRandomized = true; }
	else { var imageOrderRandomized = false; }

	if (param['orderMatters']) { var imagePairOrderingMatters = true; }
	else { var imagePairOrderingMatters = false; }

	if (param['category']) { var category = parseInt(param['category']); }
	else { var category = Math.floor(Math.random()*categories.length); }
	category = categories[category];

	if (param['debug']) { var debug = true; }
	else { var debug = false; }

}

var pairs = generatePermutationSequence(numberOfPicturesInTheCategory);

var currentQuestion = 0;
var totalQuestions = pairs.length;
var currentSelection = -1;

var log = {
	startTime: startingTime.getTime(),
	pairs: pairs,
	selection: [],
	reactionTime: [],
	category: category,
	userAgent: $.browser,
}

var comparisonBeginTime = -1;

$(function (){

	$("#introduction input").keypress(function () {
		if ($("#introduction input").val().length > 4) {
			$('#introduction .next-button a').addClass('display');
			$('#introduction p').removeClass('hidden');
		}
	});

	$('#introduction .next-button a').click((e) => {
		log.MTurkID = $("#introduction input").val();
		$('#introduction').addClass('hidden');
		$('#main-test').removeClass('hidden');
		comparisonBeginTime = e.timeStamp;
	});

	$('#total-problem').html("" + totalQuestions);

	$('#image1').click(() => {
		$('#image1').addClass('selected');
		$('#image2').removeClass('selected');
		$('#main-test .next-button a').addClass('display');
		currentSelection = 0;
	});

	$('#image2').click(() => {
		$('#image2').addClass('selected');
		$('#image1').removeClass('selected');
		$('#main-test .next-button a').addClass('display');
		currentSelection = 1;
	});

	$('#progressbar')
	.progressbar({
		max: totalQuestions,
		value: currentQuestion + 1
	})
	.progressbar( "enable" );

	$('input:text')
		.button()
		.css({
		      'font' : 'inherit',
		     'color' : 'inherit',
		'text-align' : 'left',
		   'outline' : 'none',
		    'cursor' : 'text'
		});

	// preload every image

	// update

	$('#main-test .next-button a').click( (e) => {
		if (!$('.next-button a').hasClass('display')) { return; }
		log.selection.push(pairs[currentQuestion][currentSelection]);
		log.reactionTime.push(e.timeStamp - comparisonBeginTime);

		currentSelection = -1;
		currentQuestion += 1;
		if (currentQuestion == totalQuestions) {
			$("#main-test").addClass('hidden');
			$('#survey').removeClass('hidden');
			if (debug) {
				downloadObjectAsJson(log, category + "-" + log.startTime);
			}
		} else {
			updateImages();
			comparisonBeginTime = e.timeStamp;
		}
	});

	function updateImages(){
		$('#main-test .next-button a').removeClass('display');
		$('#progressbar').progressbar("option", "value", currentQuestion);
		$('#image1').css('background-image', 'url("images/' + category + '/' + (pairs[currentQuestion][0]+1) + '.jpg")')
		$('#image2').css('background-image', 'url("images/' + category + '/' + (pairs[currentQuestion][1]+1) + '.jpg")')
		$('#current-problem').html(currentQuestion + 1);
		$('.images div').removeClass('selected');

		if (debug){
			$('#image1 span').html(pairs[currentQuestion][0]+1)
			$('#image2 span').html(pairs[currentQuestion][1]+1)
		}

	}

	updateImages();

});

// helper functions

// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function generatePermutationSequence(n) {

	var generatedList = [];
	for (var i = 0; i < n; i++) {
		for (var j = i + 1; j < n; j++) {
			if ((!imagePairOrderingMatters) && imageOrderRandomized) {
				if (Math.random() > 0.5) { generatedList.push([i,j]); }
				else { generatedList.push([j,i]); }
			} else {
				generatedList.push([i,j]);
			}
		}
	}

	if (imagePairOrderingMatters) {
		for (var i = 0; i < n; i++) {
			for (var j = i + 1; j < n; j++) {
				generatedList.push([j,i]);
			}
		}
	}

	if (imageOrderRandomized){
		return shuffle(generatedList);
	} else {
		return generatedList;
	}

}

// https://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// https://stackoverflow.com/a/30800715
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
