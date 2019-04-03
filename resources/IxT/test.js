sqrt2 = Math.sqrt(2);

$(function (){

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var userLine = [] // to store X, Y components
var userDistance = []

var $c = $("#myCanvas");
$c.mousemove((e) => {
	if (e.buttons >= 1){
		logCoordinate(e.pageX,e.pageY);
	}
	// } else {
	// 	clearLog();
	// }
	updateCanvas();
});

$c.mouseup((e) => {
	clearLog();
	updateCanvas();
});

function updateCanvas(){
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.strokeStyle = "green";

	// y = x, x in [200, 400]
	ctx.beginPath();
	ctx.moveTo(200, 200);
	ctx.lineTo(400, 400);
	ctx.stroke();

	if (userLine.length > 1){
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(userLine[0][0], userLine[0][1]);
		for (var i = 0; i < userLine.length - 1; i++) {
			ctx.lineTo(userLine[i][0], userLine[i][1]);
		}
		ctx.stroke();
	}
}

function calculateDistanceToTheTracingLine(userX, userY){
	if (userX + userY <= 400){
		return Math.sqrt((userX - 200)**2 + (userY - 200)** 2);
	} else if (userX + userY >= 800){
		return Math.sqrt((userX - 400)**2 + (userY - 400)** 2);
	}
	return Math.abs(userX - userY) / sqrt2;
}

function logCoordinate(x,y){
	// console.log(x, y);
	userLine.push([x, y]);
	var distance = calculateDistanceToTheTracingLine(x, y)
	userDistance.push(distance);
	console.log(distance);
}

function clearLog() {
	if (userDistance.length > 0) {
		console.log("avg", userDistance.reduce((a, b) => a + b, 0)/userDistance.length);
		console.log("score", userDistance.reduce((a, b) => a + b**2, 0)/userDistance.length);
	}
	userLine = []
	userDistance = []
}

updateCanvas();

});