
var chartWidth = 900;
var chartHeight = 450;
var padding = 55;

var eventDetail=d3.select('body').append('div')
	.style('position', 'absolute')
	.style('padding', '0 10px')
	.style('background', 'yellow')
	.style('opacity', 0);
var dotData = [];
var startTime = new Date("2300-01-01");
var endTime = new Date("1800-01-01");
var maxCount = 0;

function updateEventChart(categoryId, categoryName) {

	dotData = [];
	startTime = new Date("2300-01-01");
	endTime = new Date("1800-01-01");
	maxCount = 0;

	updateData();
	//console.log("After call updateData: "+dotData);



};

function updateData(){

	var selectedCount = 0;
	var currentCount = 0;
	for(var i = 0; i<showStatus.length; i++){
		if(showStatus[i] == 1){
			selectedCount++;
		}
	}

	// push all selected tag data into dotData array
	for(var i = 0; i<showStatus.length; i++){
		if(showStatus[i]==1){
			currentCount++;
			var id = i+1;
			var selectedFilename = "./data/events_headcount/category"+id+"_events.json";
			console.log("Selected file: "+selectedFilename);

			d3.json(selectedFilename, function (error, cdata) {
				if(error) return console.warn(error);

				cdata.sort(function(a, b){
					if(a.event.date > b.event.date) return 1;
					if(a.event.date < b.event.date) return -1;
					return 0;
				});

				var startTime1 = new Date(cdata[0].event.date);
				var endTime1 = new Date(cdata[cdata.length-1].event.date);
				var maxCount1 = d3.max(cdata, function(d, i){return d.event.headcount;});
				if(startTime>startTime1) startTime = startTime1;
				if(endTime<endTime1) endTime = endTime1;
				if(maxCount1>maxCount) maxCount = maxCount1;
				//dotData.push(cdata);

				for(var v = 0; v<cdata.length; v++){
					dotData.push(cdata[v]);
				}

				update(selectedCount, currentCount);
			})
		}else{

		}
	}

}

function update(selectedCount, currentCount){
	if(selectedCount != currentCount) return;

	// first clean up any element in eventchart
	d3.select('#eventChart').selectAll("*").remove();
	//var chartTitle = d3.select('#eventChart').append("p").text(categoryName);
	var chartView = d3.select('#eventChart')
		.append('svg')
		.attr('width', chartWidth)
		.attr('height', chartHeight);

	var xScale = d3.time.scale().domain([startTime, endTime]).range([0, chartWidth-padding]);
	var yScale = d3.scale.linear().domain([maxCount,0]).range([55, chartHeight]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	chartView.append("g").attr("class", "axis").attr("transform", "translate("+padding+","+(chartHeight-padding+2) +")").call(xAxis);

	var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(20);

	chartView.append("g").attr("class", "axis").attr("transform", "translate("+(padding)+","+-padding+")").call(yAxis);

	for(var x = 0; x<dotData.length; x++){
		//console.log("current dot data length: "+x);
		var circles = chartView.selectAll("circle").data(dotData).enter().append("circle");

		circles.attr("cx", function(d){

			var xValue = new Date(d.event.date);

			return xScale(xValue)+padding;

		});

		circles.attr("cy", function(d,i){
			return yScale(d.event.headcount)-padding;
		});

		circles.attr("r", 2);
		circles.attr("fill", function(d,i){
			return catColor[d.category.id-1];
		});

		circles.on('mouseover', function(d){
			eventDetail.transition().style('opacity',.9);

			eventDetail.html(d.category.name+"</br>"+d.event.name+"</br>"+ d.event.headcount).style('left', (d3.event.pageX)+'px')
				.style('top', (d3.event.pageY)+'px');
			d3.select(this)
				.style('stroke', 'red')
				.style('stroke-width', 1);
		});

		circles.on('mouseout', function(d){
			eventDetail.transition()
				.style('opacity', 0);

			d3.select(this)
				.style('stroke-width', 0);
		});
	}


};

