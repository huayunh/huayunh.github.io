$(function (){

	// js enabled. Hide the "enable your js" alert.
	$('#js-alert').hide();

	// do d3 if on desktop
	if( $('#on-mobile').css('display')=='none') {
		displayD3Charts();
	}
})

function displayD3Charts() {
	d3_myDay();
}

function d3_myDay() {

	var defaultText = "Hover and click to see what happens!";
  	$('#chart1+.tooltip').text(defaultText).css('opacity', 0.5);

  	// data for the inner ring
	var data = [
		{ label: 'on homework',        count: 8, class: 'hw'},
		{ label: 'in classes',         count: 4, class: 'cl'},
		{ label: 'in design critique', count: 1, class: 'dc'},
		{ label: 'on Wikipedia',       count: 1, class: 'wp'},
		{ label: 'in commuting',       count: 1, class: 'ic'},
		{ label: 'eating',             count: 2, class: 'ea'},
		{ label: 'sleeping',           count: 7, class: 'sl'}, 
	];

	// data for the outer ring
	var subData = [
		{label: 'in reading',          count: 3,   class:'hw'},
		{label: 'in thinking',         count: 2,   class:'hw'},
		{label: 'in coding',           count: 3,   class:'hw'},
		{label: 'without coffee',      count: 3.9, class:'cl'},
		{label: 'with coffee',         count: 0.1, class:'cl'},
		{label: 'convince them',       count: 0.6, class:'dc'},
		{label: 'convinced',           count: 0.4, class:'dc'},
		{label: 'edit',                count: 0.5, class:'wp'},
		{label: 'edit war',            count: 0.5, class:'wp'},
		{label: 'going to the campus', count: 0.8, class:'ic'},
		{label: 'going back',          count: 0.2, class:'ic'}, 
		{label: 'lunch',               count: 1,   class:'ea'},
		{label: 'dinner',              count: 1,   class:'ea'},
		{label: 'day dreaming',        count: 1,   class:'sl'},
		{label: 'night dreaming',      count: 6,   class:'sl'}
	];

	var canvasWidth = $('#chart1').width();
	var canvasHeight = parseInt($('#chart1').css('height'));
	var width = canvasWidth * 0.7;
	var height = width;

	var radius = Math.min(width, height) / 2;

	var color = d3.scaleOrdinal(d3.schemeCategory20c);

	var svg = d3.select('#chart1')
				.append('svg')
				.attr('width', canvasWidth)
				.attr('height', canvasHeight)
				.append('g')
				.attr('transform', 'translate(' + (canvasWidth / 2) +  ',' + (canvasHeight / 2) + ')');

	var arc = d3.arc()
				.innerRadius(radius*0.3)
				.outerRadius(radius);
	var arc2= d3.arc()
				.innerRadius(radius)
				.outerRadius(canvasWidth/2);

	var pie = d3.pie()
				.value(function(d) { return d.count; })
				.sort(null);

	var path = svg.append('g')
				  .selectAll('path')
				  .data(pie(data))
				  .enter()
				  .append('path')
				  .attr('d', arc)
				  .attr('fill', function(d, i) {
					return color(d.data.label);
					})
				  .on('mouseover', function(d) {
					$('#chart1+.tooltip').text("Time spent "+d.data.label+": "+d.data.count+" hours")
										 .css('opacity', 1);
					})
				  .on('mouseout', function() {
				  	$('#chart1+.tooltip').text(defaultText).css('opacity', 0.5);
				  })
				  .on('click', function (d){
				  	$('.sub path').addClass('hidden');
				  	$('.'+d.data.class).removeClass('hidden');
				  });

	svg.append('g')
	   .classed('sub', true)
	   .selectAll('path')
	   .data(pie(subData))
	   .enter()
	   .append('path')
	   .attr('d', arc2)
	   .attr('fill', function(d, i) {
			return color(d.data.label);
		})
	   .attr('class', function(d) {
	   		return d.data.class;
	    })  
	   .classed('hidden', true)
	   .on('mouseover', function(d) {
			$('#chart1+.tooltip').text("Time spent "+d.data.label+": "+d.data.count+" hours")
								 .css('opacity', 1);
			})
	   .on('mouseout', function() {
		 	$('#chart1+.tooltip').text(defaultText).css('opacity', 0.5);
	    })


}