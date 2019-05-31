
// constants
const categories = [
	'bricks',
]
const numberOfPicturesInTheCategory = 3;

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

}

var pairs = generatePermutationSequence(numberOfPicturesInTheCategory);

var currentQuestion = 0
var totalQuestions = pairs.length;

$(function (){

	$('#total-problem').html("" + totalQuestions);

	$('#image1').click(() => {
		$('#image1').addClass('selected');
		$('#image2').removeClass('selected');
		$('#next-button a').addClass('display');
	});

	$('#image2').click(() => {
		$('#image2').addClass('selected');
		$('#image1').removeClass('selected');
		$('#next-button a').addClass('display');
	});

	$('#progressbar')
		.progressbar({
			max: totalQuestions,
			value: currentQuestion + 1
		})
		.progressbar( "enable" );

	// preload every image

	// update

	$('#next-button a').click( () => {
		if (!$('#next-button a').hasClass('display')) { return; }
		currentQuestion += 1;
		console.log(currentQuestion)
		updateImages();
	});

	function updateImages(){
		$('#next-button a').removeClass('display');
		$('#progressbar').progressbar("option", "value", currentQuestion);
		$('#image1').css('background-image', 'url("images/' + category + '/' + (pairs[currentQuestion][0]+1) + '.jpg")')
		$('#image2').css('background-image', 'url("images/' + category + '/' + (pairs[currentQuestion][1]+1) + '.jpg")')
		$('#current-problem').html(currentQuestion + 1);
		$('.images div').removeClass('selected');
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
			generatedList.push([i,j]);
		}
	}
	for (var i = 0; i < n; i++) {
		for (var j = i + 1; j < n; j++) {
			generatedList.push([j,i]);
		}
	}

	return generatedList;
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
