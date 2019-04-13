// the following are lines that are not used during the 
// test but are left here just in case it might be interesting 
// to have as a record

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
{
	// x = 300

	start: [300, 150],
	end: [300, 450],

	distance : function (x,y) {
		if (y <= 150) {
			return distanceBetweenPoints([x,y], this.start);
		} else if (y >= 450) {
			return distanceBetweenPoints([x,y], this.end);
		} else {
			return Math.abs(x - 300);
		}
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.start[0], this.start[1]);
		ctx.lineTo(this.end[0], this.end[1]);
		ctx.stroke();
	}
},
]