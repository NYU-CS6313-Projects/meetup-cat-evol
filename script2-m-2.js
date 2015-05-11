
var margin = { top: 50, right: 30, bottom: 30, left:50 }
var height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    //barWidth = 50,
    //barOffset = 5;
//var xScale, yScale, xAxis, yAxis, xGuide, yGuide;
var xScale, yScale;

var dateRange=[new Date("2300-01-01"), new Date("1800-01-01")],
    valRange=[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

//var dateRange=[], valRange=[];

var cat_line=[], data=[];


function convertDate(num){
    var resultDate = new Date(num.substr(0, 4),num.substr(4, 2)-1, num.substr(6, 2));
    return resultDate;
}


var myChart = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

for(var i=1; i<=35; i++){
    var filename="./data/category_"+i+"_result.json";
    //console.log(filename);
    d3.json(filename, function(error, cdata){
        if(error) return console.warn(error);
        //console.log(cdata);
        var c_dateRange=d3.extent(cdata, function(d){
            return convertDate(d.date);
        });

        var c_valRange=d3.extent(cdata, function(d){
            return d.num;
        })


        if(c_valRange[0]<valRange[0]) valRange[0]=c_valRange[0];
        if(c_valRange[1]>valRange[1]) valRange[1]=c_valRange[1];
        if(c_dateRange[0]<dateRange[0]) dateRange[0]=c_dateRange[0];
        if(c_dateRange[1]>dateRange[1]) dateRange[1]=c_dateRange[1];

        data.push(cdata);
        update();
    });
}

var yGuide = myChart.append('g');
var xGuide = myChart.append('g');

function update() {
    console.log(data);
    console.log(dateRange);


    var xScale=d3.time.scale().domain([dateRange[0], dateRange[1]]).range([0, width]);
    console.log(valRange);
    var yScale=d3.scale.linear().domain([valRange[0], valRange[1]]).range([height, 0]);

    //alert();
    var sel = myChart.selectAll('g.lines').data(data);
    sel.exit().remove();
    sel.enter().append('g')
        .classed("lines", true)
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .append('path')
        .attr('class', function(_, j) { return 'cat'+(j+1); });

    var theLine = d3.svg.line()
    .x(function(d, i){
        //console.log(xScale(i));
        return xScale(convertDate(d.date));
    })
    .y(function (d) {
        //console.log(yScale(d['num']));
        return yScale(d.num);
    });
    sel.selectAll("path").attr('d', theLine);


    // draw axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
        //.ticks(20)

    yAxis(yGuide);

    yGuide.attr('transform', 'translate(' + margin.left + ', '+ margin.top +')');
    yGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000"});
    yGuide.selectAll('line')
        .style({ stroke: "#000"});

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
        //.tickValues(xScale.domain().filter(function(d, i) {
        //    return !(i % (bardata.length/5));
        //}))

    xAxis(xGuide);
    xGuide.attr('transform', 'translate(' + margin.left + ', ' + (height+margin.top) + ')');
    xGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000"});
    xGuide.selectAll('line')
        .style({ stroke: "#000"});


    var lSpace=width/data.length;

    myChart.append('text')
        .attr('x', (lSpace/2)+i*lSpace)
        .attr('y', 20)
        .style('fill', 'black')
        .text(i)
}
