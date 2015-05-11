var margin = { top: 30, right: 30, bottom: 30, left:50 }
var height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    //barWidth = 50,
    //barOffset = 5;
//var xScale, yScale, xAxis, yAxis, xGuide, yGuide;
var xScale, yScale, xAxis, yAxis;

var dateRange=[new Date("2300-01-01"), new Date("1800-01-01")],
    valRange=[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

//var dateRange=[], valRange=[];

var data=[];

// alert(data.length);

var getDate=d3.time.format("%Y%m%d");

var theLine = d3.svg.line()
    .x(function(d, i){
        //console.log(xScale(i));
        return xScale(getDate.parse(d.date));
    })
    .y(function (d) {
        //console.log(yScale(d['num']));
        return yScale(d.num);
    });

var tooltip=d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'yellow')
        .style('opacity', 0);


var lineSvg = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);


d3.json('./data/cat-group-num-all.json', function(error, cdata){
    if(error) return console.warn(error);
    console.log(cdata);

    data=cdata;

    updateScale();
    // drawAxes(xScale, yScale);


    var lines = lineSvg.selectAll('g.lines').data(data);

    lines.enter().append('g')
        .classed("lines", true)
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .append('path')
        .attr('stroke', function(_, i){return catColor[i];})
        .attr('fill', 'none')
        .attr('class', function(_, i) { return 'cat'+(i+1); })
        .on('mouseover', function(d, i){
            tooltip.transition()
                .style('opacity', .9);

            tooltip.html(d.catname)
                .style('left', (d3.event.pageX)+'px')
                .style('top', (d3.event.pageY)+'px');

            d3.select(this)
                .style('stroke-width', 3);
        })
        .on('mouseout', function(d){
            tooltip.transition()
                .style('opacity', 0);

            d3.select(this)
                .style('stroke-width', 1);
        });

    lines.selectAll("path").attr('d', function(d){return theLine(d.val);});

    drawAxes();
    updateMatrix();
});



function updateLine(){
    // lineSvg.selectAll('g').remove();

    // var lines=d3.select('#chart').transition();

    updateScale();

    for(var i=0; i<data.length; i++){
        var setColor=function(){
                if (showStatus[i]==1) return catColor[x];
                else return '#E5E5E5';
        }
    }

    var lines=d3.selectAll('g.lines').remove();

    lines = lineSvg.selectAll('g.lines').data(data);

    lines.enter().append('g')
        .classed("lines", true)
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .append('path')
        .attr('stroke', function(_, i){
            if (showStatus[i]==1) return catColor[i];
            else return '#E5E5E5';
        })
        .attr('fill', 'none')
        .attr('class', function(_, i) { return 'cat'+(i+1); })
        .on('mouseover', function(d, i){
            tooltip.transition()
                .style('opacity', .9);

            tooltip.html(d.catname)
                .style('left', (d3.event.pageX)+'px')
                .style('top', (d3.event.pageY)+'px');

            d3.select(this)
                .style('stroke-width', 3);
        })
        .on('mouseout', function(d){
            tooltip.transition()
                .style('opacity', 0);

            d3.select(this)
                .style('stroke-width', 1);
        });

    lines.selectAll("path").attr('d', function(d){return theLine(d.val);});


    // for(var x=0; x<data.length; x++){
    //     var setColor=function(){
    //         if (showStatus[x]==1) return catColor[x];
    //         else return '#E5E5E5';
    //     }
    //
    //     lineSvg.append('g')
    //         .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
    //         .append('path')
    //         .attr('stroke', setColor)
    //         .attr('fill', 'none')
    //         .attr('d', theLine(data[x]))
    //         .on('mouseover', function(){
    //             tooltip.transition()
    //                 .style('opacity', .9);
    //
    //             tooltip.html("Category "+x)
    //                 .style('left', (d3.event.pageX)+'px')
    //                 .style('top', (d3.event.pageY)+'px');
    //
    //             d3.select(this)
    //                 .style('stroke-width', 3);
    //         })
    //         .on('mouseout', function(d){
    //             tooltip.transition()
    //                 .style('opacity', 0);
    //
    //             d3.select(this)
    //                 .style('stroke-width', 1);
    //         });;
    // }

    // drawAxes(xScale, yScale);
    updateAxes();
}


function oneLine(catid){

    catid=catid-1;

    console.log(catid);

    dateRange=d3.extent(data[catid], function(d){

        return getDate.parse(d.date);
    });
    valRange=d3.extent(data[catid], function(d){
        return d.num;
    })

    xScale=d3.time.scale().domain([dateRange[0], dateRange[1]]).range([0, width]);
    console.log(valRange);
    yScale=d3.scale.linear().domain([valRange[0], valRange[1]]).range([height, 0]);

    lineSvg.selectAll('g').remove();


    // var theLine = d3.svg.line()
    //     .x(function(d, i){
    //         //console.log(xScale(i));
    //         return xScale(getDate.parse(d.date));
    //     })
    //     .y(function (d) {
    //         //console.log(yScale(d['num']));
    //         return yScale(d.num);
    //     });

    lineSvg.append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .append('path')
        // .attr('class', 'cat'+(catid+1))
        .attr('stroke', catColor[catid])
        .attr('fill', 'none')
        .attr('d', theLine(data[catid]));


    // drawAxes(xScale, yScale);
    updateAxes();
}

function updateScale(){
    dateRange=[new Date("2300-01-01"), new Date("1800-01-01")];
    valRange=[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

    for(var x=0; x<showStatus.length; x++){

        if(showStatus[x]==1){
            var c_dateRange=d3.extent(data[x].val, function(d){
                return getDate.parse(d.date);
            });
            var c_valRange=d3.extent(data[x].val, function(d){
                return d.num;
            });

            if(c_valRange[0]<valRange[0]) valRange[0]=c_valRange[0];
            if(c_valRange[1]>valRange[1]) valRange[1]=c_valRange[1];
            if(c_dateRange[0]<dateRange[0]) dateRange[0]=c_dateRange[0];
            if(c_dateRange[1]>dateRange[1]) dateRange[1]=c_dateRange[1];
        }
    }

    xScale=d3.time.scale().domain([dateRange[0], dateRange[1]]).range([0, width]);
    yScale=d3.scale.linear().domain([valRange[0], valRange[1]]).range([height, 0]);

    // alert(dateRange);

}

// function drawAxes(xScale, yScale){
//     var yAxis = d3.svg.axis()
//             .scale(yScale)
//             .orient('left');
//             //.ticks(20)
//
//     var yGuide = lineSvg.append('g');
//         yAxis(yGuide);
//         yGuide.attr('transform', 'translate(' + margin.left + ', '+ margin.top +')');
//         yGuide.selectAll('path')
//             .style({ fill: 'none', stroke: "#000"});
//         yGuide.selectAll('line')
//             .style({ stroke: "#000"});
//
//     var xAxis = d3.svg.axis()
//             .scale(xScale)
//             .orient('bottom')
//             //.tickValues(xScale.domain().filter(function(d, i) {
//             //    return !(i % (bardata.length/5));
//             //}))
//
//     var xGuide = lineSvg.append('g')
//         xAxis(xGuide)
//         xGuide.attr('transform', 'translate(' + margin.left + ', ' + (height+margin.top) + ')')
//         xGuide.selectAll('path')
//             .style({ fill: 'none', stroke: "#000"})
//         xGuide.selectAll('line')
//             .style({ stroke: "#000"})
// }

function drawAxes(){
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
    // Add the X Axis
    lineSvg.append("g")
        .attr("class", "x axis")
        .attr('transform', 'translate(' + margin.left + ', ' + (height+margin.top) + ')')
        .call(xAxis);


    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
    // Add the Y Axis
    lineSvg.append("g")
        .attr("class", "y axis")
        .attr('transform', 'translate(' + margin.left + ', '+ margin.top +')')
        .call(yAxis);
}

function updateAxes(){
    var lines=d3.select('#chart').transition();

    xAxis.scale(xScale);
    lines.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);

    yAxis.scale(yScale);
    lines.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
}
