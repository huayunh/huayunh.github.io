
// constants
const categories = {
'qokjviw':'bricks',
'uvbslqp':'bokeh',
'nvskdfp':'abstract',
'whalsvm':'pattern',
'qupxsaz':'fullframeplants',
'ajlbwwl':'treeBark',
};
const numberOfPicturesInTheCategory = 10;
const startingTime = new Date();
const backgroundPlaceHolder = ", url('loading.svg')";

// parameters
var categoryKeys = Object.keys(categories);
var param = getUrlVars();
if (param) {

	if (param['sequential']) { var imageOrderRandomized = false; }
	else { var imageOrderRandomized = true; }

	if (param['orderMatters']) { var imagePairOrderingMatters = true; }
	else { var imagePairOrderingMatters = false; }

	if (param['category']) {
		var category = parseInt(param['category']);

		// if the category passed in is not an integer
		if (isNaN(category)) {

			category = categories[param['category']];

			// if the category passed in does not exist in categories
			if (category === undefined) {
				// pick one at random
				var category = Math.floor(Math.random()*categoryKeys.length); 
				category = categories[categoryKeys[category]];
			}
		}

		// passed in an integer category
		else {
			category = categories[categoryKeys[category]];
		}
	}
	else { 
		// alert("No category provided. Do not modify the URL.");
		var category = Math.floor(Math.random()*categoryKeys.length); 
		category = categories[categoryKeys[category]];
	}

	if (param['debug']) { var debug = true; }
	else { var debug = false; }

	if (param['practice']) { 
		var numberOfPracticePairs = parseInt(param['practice']); 
		if (numberOfPracticePairs < 0) {numberOfPracticePairs=0;}
	}
	else { var numberOfPracticePairs = 5; }


}

var pairs = generatePermutationSequence(numberOfPicturesInTheCategory);

if ((numberOfPracticePairs > 0) && (!imagePairOrderingMatters)) {

	var practicePairs = getRandomSubarray(pairs.slice(1), numberOfPracticePairs);
	for (var i = 0; i < practicePairs.length; i++) {
		let temp0 = practicePairs[i][0];
		let temp1 = practicePairs[i][1];
		practicePairs[i] = [temp1, temp0];
	}
	pairs = practicePairs.concat(pairs);

}

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

	$('total-questions').html(totalQuestions);

	// preload

	for (var i = 0; i < numberOfPicturesInTheCategory; i++) {
		$('#preload').append('<div id="preload' + i +'"></div>')
		$('#preload'+i).css('background-image', 'url("images/' + category + '/' + (i+1) + '.jpg")');
	}
	// $('#preload').addClass('hidden');
	$('#introduction').removeClass('hidden');

	// introduction page

	$('.hidden-mail').html('maxion');

	$('#introduction .next-button a').click((e) => {
		if (/^[a-zA-Z0-9]+$/i.test($("#introduction input").val())) {
			log.MTurkID = $("#introduction input").val();
			$('#introduction').addClass('hidden');
			$('#main-test').removeClass('hidden');
			comparisonBeginTime = e.timeStamp;
		} else {
			$("#introduction input").css('border-color', '#e96161');
		}
	});

	// main test

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

	$('#main-test .next-button a').click( (e) => {
		if (!$('#main-test .next-button a').hasClass('display')) { return; }
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

			$.post("/subjectFinished", JSON.stringify(log), function( data ) {
				console.log(data);
			});
			
		} else {
			updateImages();
			comparisonBeginTime = e.timeStamp;
		}
	});

	function updateImages(){
		$('#main-test .next-button a').removeClass('display');
		$('#progressbar').progressbar("option", "value", currentQuestion);
		$('#image1')
			.css('background-image', 'url("images/'
				+ category + '/' + (pairs[currentQuestion][0]+1) + '.jpg")' 
				+ backgroundPlaceHolder);
		$('#image2')
			.css('background-image', 'url("images/'  
				+ category + '/' + (pairs[currentQuestion][1]+1) + '.jpg")' 
				+ backgroundPlaceHolder);
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
			if (!imagePairOrderingMatters) {
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

// https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
function getRandomSubarray(arr, size) {
	if (arr.length < size) {
		return [];
	}
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}
