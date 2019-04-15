// constants
const sqrt2 = Math.sqrt(2);
const s300 = 300 - 75 * sqrt2;
const l300 = 300 + 75 * sqrt2;

const taskNames = ["tracing", "connecting"];
const pointerCirleRadius = 80;
const anchorPressure = 0.5;

const tracingLines = [
{
	// y = x, x in [300 - 75 * sqrt2, 300 + 75 * sqrt2]

	start: [s300, s300],
	end: [l300, l300],

	// function that returns the distance to it given (x,y)
	distance : function (x,y) {
		if (x + y <= s300 * 2){
			return distanceBetweenPoints([x,y], [s300, s300]);
		} else if (x + y >= l300 * 2){
			return distanceBetweenPoints([x,y], [l300, l300]);
		}
		return Math.abs(x - y) / sqrt2;
	}
}, 
{
	// y = 300, x in [150, 450]

	start: [150, 300],
	end: [450, 300],

	distance : function (x,y) {
		if (x <= 150) {
			return distanceBetweenPoints([x,y], [150, 300]);
		}
		if (x >= 450) {
			return distanceBetweenPoints([x,y], [450, 300]);
		}
		return Math.abs(y - 300);
	}
},
{
	// y = -x + 600, x in [s300, l300]

	start: [s300, l300],
	end: [l300, s300],

	distance : function (x,y) {
		if (y - x >= l300 - s300) {
			return distanceBetweenPoints([x,y], [s300, l300]);
		}
		if (y - x <= s300 - l300) {
			return distanceBetweenPoints([x,y], [l300, s300]); 
		}
		return Math.abs(-x + 600 - y) / sqrt2;
	}
},
{
	// x = 300, y in [450, 150]

	start: [300, 450],
	end: [300, 150],

	distance : function (x,y) {
		if (y <= 150) {
			return distanceBetweenPoints([x,y], [300, 150]);
		}
		if (y >= 450) {
			return distanceBetweenPoints([x,y], [300, 450]);
		}
		return Math.abs(x - 300);
	}
},
{
	// y = x, x in [300 - 75 * sqrt2, 300 + 75 * sqrt2]

	end: [s300, s300],
	start: [l300, l300],

	// function that returns the distance to it given (x,y)
	distance : function (x,y) {
		if (x + y <= s300 * 2){
			return distanceBetweenPoints([x,y], [s300, s300]);
		} else if (x + y >= l300 * 2){
			return distanceBetweenPoints([x,y], [l300, l300]);
		}
		return Math.abs(x - y) / sqrt2;
	}
}, 
{
	// y = 300, x in [150, 450]

	end: [150, 300],
	start: [450, 300],

	distance : function (x,y) {
		if (x <= 150) {
			return distanceBetweenPoints([x,y], [150, 300]);
		}
		if (x >= 450) {
			return distanceBetweenPoints([x,y], [450, 300]);
		}
		return Math.abs(y - 300);
	}
},
{
	// y = -x + 600, x in [s300, l300]

	end: [s300, l300],
	start: [l300, s300],

	distance : function (x,y) {
		if (y - x >= l300 - s300) {
			return distanceBetweenPoints([x,y], [s300, l300]);
		}
		if (y - x <= s300 - l300) {
			return distanceBetweenPoints([x,y], [l300, s300]);
		}
		return Math.abs(-x + 600 - y) / sqrt2;
	}
},
{
	// x = 300, y in [450, 150]

	end: [300, 450],
	start: [300, 150],

	distance : function (x,y) {
		if (y <= 150) {
			return distanceBetweenPoints([x,y], [300, 150]);
		}
		if (y >= 450) {
			return distanceBetweenPoints([x,y], [300, 450]);
		}
		return Math.abs(x - 300);
	}
},
]

// number of line drawn in the current run
var currentTracingLine = 0;
// number of runs. One run = 8 lines
var currentRun = 0;

var sessionLog = [];

// 0 = tracingLine task
// 1 = connectingDots task
var connectingDots = 0; 

// total number of
// if practice run, set the runs to 2

var totalRuns; 
var param = getUrlVars();
if (param && param['runs']) {
	// practice run
	totalRuns = parseInt(param['runs']);
} else {
	// actual study
	totalRuns = 10;
}

$(function (){

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var userLine; // to store X, Y components
var userDistance; // to store distance between user line and computed tracing line
var startTime;
var endTime;
var currentPointerLocation;
var currentPointerPressure;

var $c = $("#myCanvas");

$c.mousedown((e) => {

	// if experiment has ended
	if (connectingDots == -1) {
		return;
	}

	var rect = c.getBoundingClientRect();
	logCoordinate(e.clientX - rect.left, e.clientY - rect.top);
	startTime = e.timeStamp;
});

$c.mouseup((e) => {

	// if experiment has ended
	if (connectingDots == -1) {
		return;
	}

	endTime = e.timeStamp;
	if (clearLog()) {
		currentTracingLine = (currentTracingLine + 1) % tracingLines.length;
		if (currentTracingLine == 0) {
			currentRun += 1;
			if (currentRun >= totalRuns) {
				if (connectingDots == 0) {
					// move on to the connecting dots task
					connectingDots = 1;
					currentRun = 0;
					$('#hint-text')
						.html('Please connect the dots using a straight line. Please draw from the blue dot.');
				} else if (connectingDots == 1) {
					// everything is finished, end of experiment
					ctx.clearRect(0, 0, c.width, c.height);
					ctx.fillStyle = "#ccc";
					ctx.fillText("end", c.width/2, c.height/2);
					connectingDots = -1;

					var today = new Date();
					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
					var yyyy = today.getFullYear();
					var hh = String(today.getHours()).padStart(2, '0');
					var minute = String(today.getMinutes()).padStart(2, '0');
					downloadObjectAsJson(sessionLog, yyyy+mm+dd+hh+minute);
					return;
				}
			}
		}
	}
	updateCanvas();
});

c.addEventListener('pointermove', function(e) {

	// if experiment has ended
	if (connectingDots == -1) {
		return;
	}

	var rect = c.getBoundingClientRect();

	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;

	if (e.buttons >= 1){
		if (e.pointerType == "mouse") {
			currentPointerLocation = [-1, -1];
			logCoordinate(x, y, e.timeStamp, -1);
		} else {
			currentPointerLocation = [x, y];
			currentPointerPressure = e.pressure;
			logCoordinate(x, y, e.timeStamp, e.pressure);
		}
		updateCanvas();
	}
}, false);

function updateCanvas(){
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.font = "90px Arial";
	ctx.fillStyle = "#ccc";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle"; 
	ctx.fillText(currentRun + 1, c.width/2, c.height/2);

	if (connectingDots == 0) {
		ctx.strokeStyle = "green";
		ctx.beginPath();
		ctx.moveTo(tracingLines[currentTracingLine].start[0], tracingLines[currentTracingLine].start[1]);
		ctx.lineTo(tracingLines[currentTracingLine].end[0], tracingLines[currentTracingLine].end[1]);
		ctx.stroke();

		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.arc(tracingLines[currentTracingLine].start[0], tracingLines[currentTracingLine].start[1], 3, 0, 2 * Math.PI);
		ctx.fill();

		if (currentPointerLocation[0] !== -1){

			ctx.fillStyle = "#0005";
			ctx.beginPath();
			ctx.arc(currentPointerLocation[0], 
				currentPointerLocation[1], 
				pointerCirleRadius*currentPointerPressure, 0, 2 * Math.PI);
			ctx.fill();

			ctx.strokeStyle = "green";
			ctx.beginPath();
			ctx.arc(
				currentPointerLocation[0], 
				currentPointerLocation[1], 
				pointerCirleRadius * anchorPressure, 0, 2 * Math.PI);
			ctx.stroke();
		}

	} else if (connectingDots = 1) { 
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.arc(tracingLines[currentTracingLine].start[0], tracingLines[currentTracingLine].start[1], 3, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(tracingLines[currentTracingLine].end[0], tracingLines[currentTracingLine].end[1], 3, 0, 2 * Math.PI);
		ctx.fill();

		if (currentPointerLocation[0] !== -1){

			ctx.fillStyle = "#0005";
			ctx.beginPath();
			ctx.arc(currentPointerLocation[0], 
				currentPointerLocation[1], 
				pointerCirleRadius*currentPointerPressure, 0, 2 * Math.PI);
			ctx.fill();

			ctx.strokeStyle = "green";
			ctx.beginPath();
			ctx.arc(
				currentPointerLocation[0], 
				currentPointerLocation[1], 
				pointerCirleRadius * anchorPressure, 0, 2 * Math.PI);
			ctx.stroke();
		}

	}

	// draw the user lines
	if (userLine.length > 1){
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(userLine[0].x, userLine[0].y);
		for (var i = 0; i < userLine.length - 1; i++) {
			ctx.lineTo(userLine[i].x, userLine[i].y);
		}
		ctx.stroke();
	}
}

function calculateDistanceToTheTracingLine(userX, userY){
	return tracingLines[currentTracingLine].distance(userX, userY);
}

function logCoordinate(x,y, time, pressure){
	var distance = calculateDistanceToTheTracingLine(x, y);
	userLine.push(
		{
			"x": x, 
			"y": y, 
			"time": time,
			"distance": distance,
			"pressure": pressure
		});
	userDistance.push(distance);
}

function clearLog() {

	if (userLine && userLine.length > 15) {
		var firstUserPointToTracingLineDistance = 
			distanceBetweenPoints([userLine[0].x, 
								   userLine[0].y], 
								   tracingLines[currentTracingLine].start);
		var lastUserPointToTracingLineDistance = 
			distanceBetweenPoints([userLine[userLine.length - 1].x, 
								   userLine[userLine.length - 1].y], 
								   tracingLines[currentTracingLine].end);
		userDistance[0] = firstUserPointToTracingLineDistance;
		userDistance.push(lastUserPointToTracingLineDistance);
		var averageDistance = userDistance.reduce((a, b) => a + b, 0)/userDistance.length;
		var score = userDistance.reduce((a, b) => a + b**2, 0)/userDistance.length;
		sessionLog.push(
			{
				"timeStart": startTime,
				"timeFinished": endTime,
				"timeElapsed": endTime - startTime,
				"task": taskNames[connectingDots],
				"averageDistance": averageDistance,
				"run": currentRun,
				"line": currentTracingLine,
				"score": score,
				"seq": userLine.slice(1, userLine.length-1)
			}
		);
		console.log("time", (endTime - startTime)/1000);
		console.log("avg", averageDistance);
		console.log("score", score);

		startTime = -1;
		endTime = -1;
		userLine = [];
		userDistance = [-1];
		currentPointerLocation = [-1, -1];
		currentPointerPressure = 0;
		return true;
	}

	// too short
	startTime = -1;
	endTime = -1;
	userLine = [];
	userDistance = [-1];
	currentPointerLocation = [-1, -1];
	currentPointerPressure = 0;
	return false;
}

clearLog();
updateCanvas();

});

function distanceBetweenPoints(p1, p2) {
	return Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2);
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

// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}