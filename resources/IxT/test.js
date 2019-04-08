var sqrt2 = Math.sqrt(2);

var tracingLines = [
{
	// y = x, x in [200, 400]

	start: [200, 200],
	end: [400, 400],

	// function that returns the distance to it given (x,y)
	distance : function (x,y) {
		if (x + y <= 400){
			return Math.sqrt((x - 200)**2 + (y - 200)** 2);
		} else if (x + y >= 800){
			return Math.sqrt((x - 400)**2 + (y - 400)** 2);
		}
		return Math.abs(x - y) / sqrt2;
	},

	// function that draw lines given ctx
	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
{
	// y = x, x in [100, 500]

	start: [100, 100],
	end: [500, 500],

	distance : function (x,y) {
		if (x + y <= 200){
			return Math.sqrt((x - 100)**2 + (y - 100)** 2);
		} else if (x + y >= 1000){
			return Math.sqrt((x - 500)**2 + (y - 500)** 2);
		}
		return Math.abs(x - y) / sqrt2;
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
{
	// y = 2x-400, x in [300, 400]

	start: [300, 200],
	end: [400, 400],

	distance : function (x,y) {
		if (y <= -0.5*x - 400 + 2 * 300 + 0.5*300) {
			return Math.sqrt((x - 300)**2 + (y - 200)** 2);
		}
		if (y >= -0.5*x - 400 + 2 * 400 + 0.5*400) {
			return Math.sqrt((x - 400)**2 + (y - 400)** 2);
		}
		return Math.sqrt((2*x - 400 - y)**2 / 5);
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
{
	// y = -40x + 12300, x in [295, 305]

	start: [295, 500],
	end: [305, 100],

	distance : function (x,y) {
		if (y >= -1.0/(-40) * x + (-40) * 295 + 12300 + 1.0 / (-40) * 295){
			return Math.sqrt((x - 295)**2 + (y - 500)** 2);
		}
		if (y <= -1.0/(-40) * x + (-40) * 305 + 12300 + 1.0 / (-40) * 305) {
			return Math.sqrt((x - 305)**2 + (y - 100)** 2);
		}
		return Math.abs(-40 * x + 12300 - y) / Math.sqrt(1600+1);
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
{
	// y = -x + 600, x in [200, 400]

	start: [200, 400],
	end: [400, 200],

	distance : function (x,y) {
		if (y >= x + 200) {
			return distanceBetweenPoints([x,y], [200, 400]);
		}
		if (y <= x - 200) {
			return Math.sqrt((x - 400)**2 + (y - 200)** 2);
		}
		return Math.abs(-x + 600 - y) / sqrt2;
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
{
	// y = -5x + 1800, x in [250, 350]

	start: [250, 550],
	end: [350, 50],

	distance : function (x,y) {
		if (y >= - 1.0 / (-5)*x + -5 * 250 + 1800 + 1.0 / (-5) * 250) {
			return Math.sqrt((x - 250)**2 + (y - 550)** 2);
		}
		if (y <= - 1.0 / (-5)*x + -5 * 350 + 1800 + 1.0 / (-5) * 350) {
			return Math.sqrt((x - 350)**2 + (y - 50)** 2);
		}
		console.log("mi")
		return Math.abs(-5*x + 1800 - y) / Math.sqrt(26);
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
{
	// y = |x - 300| + 100, x in [200, 400]

	start: [200, 200],
	end: [400, 200],

	distance : function (x,y) {
		// close to the v line
		if (y <= x && x + y <= 600) {
			var distance1 = Math.abs(x + y - 400) / sqrt2; // distance to the left line seg
			var distance2 = Math.abs(y - x + 200) / sqrt2; // distance to the right line seg
			return Math.min(distance1, distance2);
		} else if (y >= x && x <= 300) {
			return distanceBetweenPoints([x,y], this.start);
		} else {
			return distanceBetweenPoints([x,y], this.end);
		}
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(300, 100);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
]

// var currentTracingLine = tracingLines.length - 1;
var currentTracingLine = 0;

$(function (){

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var userLine; // to store X, Y components
var userDistance; // to store distance between user line and computed tracing line
var startTime;
var endTime;

var $c = $("#myCanvas");

$c.mousedown((e) => {
	var rect = c.getBoundingClientRect();
	logCoordinate(e.clientX - rect.left, e.clientY - rect.top);
	startTime = e.timeStamp;
});

$c.mousemove((e) => {
	var rect = c.getBoundingClientRect();
	if (e.buttons >= 1){
		logCoordinate(e.clientX - rect.left, e.clientY - rect.top);
		// console.log(e);
	}
	updateCanvas();
});

$c.mouseup((e) => {
	endTime = e.timeStamp;
	clearLog();
	currentTracingLine = (currentTracingLine + 1) % tracingLines.length;
	updateCanvas();
});

function updateCanvas(){
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.font = "90px Arial";
	ctx.fillStyle = "#ccc";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle"; 
	ctx.fillText(currentTracingLine + 1, c.width/2, c.height/2);

	ctx.strokeStyle = "green";
	tracingLines[currentTracingLine].draw(ctx);

	ctx.fillStyle = "blue";
	ctx.beginPath();
	ctx.arc(tracingLines[currentTracingLine].start[0], tracingLines[currentTracingLine].start[1], 3, 0, 2 * Math.PI);
	ctx.fill();

	// ctx.fillStyle = "red";
	// ctx.beginPath();
	// ctx.arc(tracingLines[currentTracingLine].end[0], tracingLines[currentTracingLine].end[1], 3, 0, 2 * Math.PI);
	// ctx.fill();

	// draw the user lines
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
	return tracingLines[currentTracingLine].distance(userX, userY);
}

function logCoordinate(x,y){
	userLine.push([x, y]);
	var distance = calculateDistanceToTheTracingLine(x, y)
	userDistance.push(distance);
	console.log(distance);
}

function clearLog() {
	if (userDistance && userDistance.length > 1) {
		var firstUserPointToTracingLineDistance = distanceBetweenPoints(userLine[0], tracingLines[currentTracingLine].start);
		var lastUserPointToTracingLineDistance = distanceBetweenPoints(userLine[userLine.length - 1], tracingLines[currentTracingLine].end);
		userDistance[0] = firstUserPointToTracingLineDistance;
		userDistance.push(lastUserPointToTracingLineDistance);
		console.log("time", (endTime - startTime)/1000);
		console.log("avg", userDistance.reduce((a, b) => a + b, 0)/userDistance.length);
		console.log("score", userDistance.reduce((a, b) => a + b**2, 0)/userDistance.length);
	}
	startTime, endTime = -1, -1;
	userLine = [];
	userDistance = [-1];
}

clearLog();
updateCanvas();

});

function distanceBetweenPoints(p1, p2) {
	return Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2);
}