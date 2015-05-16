var margin = { top: 30, right: 30, bottom: 30, left:50 }
var height = 400 - margin.top - margin.bottom,
    width = 1150 - margin.left - margin.right;

var xScale, yScale, xAxis, yAxis;
var x1=d3.scale.ordinal();

var dateRange=[new Date("2300-01-01"), new Date("1800-01-01")],
    valRange=[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

var getDate=d3.time.format("%Y%m%d");
var getYearMonth=d3.time.format("%Y%m");


var allLine = d3.svg.line()
    .x(function(d, i){
        return xScale(getDate.parse(d.date));
    })
    .y(function (d) {
        return yScale(d.num);
    });

var monthLine = d3.svg.line()
    .x(function(d, i){
        return xScale(getYearMonth.parse(d.yearmonth));
    })
    .y(function (d) {
        return yScale(d.n);
    });


var tooltip=d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '10px 10px')
        .style('background', 'black')
        .style('color', 'white')
        .style('opacity', 0);

var linePointTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d){
            return "<strong>Time: </strong>"+d3.time.format('%b %Y')(getYearMonth.parse(d.yearmonth))+"</br><strong># group: </strong>"+d.n;
        });

var barTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d){
            return "<strong>"+d.catname+"</strong><hr><strong>Year: </strong>"+d.year+"</br><strong># group: </strong>"+d.n;
        });

var lineSvg = d3.select('#line-chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

lineSvg.call(linePointTip);
lineSvg.call(barTip);


var data_accumulate=[];
var data_monthly=[];
var data_year=[];


d3.json('./data/cat-group-num-all.json', function(error, cdata){
    if(error) return console.warn(error);
    console.log(cdata);

    data_accumulate=cdata;

    d3.json('./data/cat-group-num-by-month-raw.json', function(error, mdata){
        if(error) return console.warn(error);

        data_monthly=mdata;

        for(var i=0; i<data_monthly.length; i++){
            data_monthly[i].val.sort(function(a, b){
                if (a.yearmonth > b.yearmonth) return 1;
                if (a.yearmonth < b.yearmonth) return -1;
                return 0;
            });
        }
    });

    d3.json('./data/cat-group-num-by-year.json', function(error, ydata){
        if(error) return console.warn(error);

        data_year=ydata;
    });


    updateScale_all();
    drawAxes(xScale, yScale);
    drawLine_all();

});


function drawLine_all(){
    currentView=0;
    updateScale_all();

    for(var i=0; i<data_accumulate.length; i++){
        var setColor=function(){
                if (showStatus[i]==1) return catColor[x];
                else return '#E5E5E5';
        }
    }

    clear();

    var lines = lineSvg.selectAll('g.lines').data(data_accumulate);

    lines.enter().append('g')
        .classed("lines", true)
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .append('path')
        .attr('stroke-width', 1.5)
        .attr('stroke', function(_, i){
            if (showStatus[i]==1) return catColor[i];
            else return '#E5E5E5';
        })
        .attr('fill', 'none')
        .attr('class', function(_, i) { return 'cat'+(i+1); })
        .on('mouseover', function(d, i){
            d3.selectAll('g.lines').sort(function(a, b){
                if(a.catid!=d.catid) return -1;
                else return 1;
            })

            tooltip.transition()
                .style('opacity', .8);

            tooltip.html(d.catname)
                .style('left', (d3.event.pageX)+'px')
                .style('top', (d3.event.pageY-40)+'px');

            d3.select(this)
                .style('stroke-width', 3);
        })
        .on('mouseout', function(d){
            tooltip.transition()
                .style('opacity', 0);

            d3.select(this)
                .style('stroke-width', 1.5);
        });

    lines.selectAll("path").attr('d', function(d){return allLine(d.val);});

    updateAxes();
}


function drawLine_month(){
    currentView=1;

    var drawData=getDrawData(data_monthly);

    updateScale_month();
    updateAxes();

    clear();

    lineSvg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
      .on("mousemove", mousemove);

    var lines = lineSvg.selectAll('g.lines').data(drawData);
    lines.enter().append('g')
        .classed("lines", true)
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .append('path')
        .attr('stroke', function(d){return catColor[d.catid-1];})
        .attr('fill', 'none')
        .attr('class', function(d) { return 'cat'+d.catid; })
        .on('mouseover', function(d, i){
            tooltip.transition()
                .style('opacity', .8);

            tooltip.html("<strong>"+d.catname+"</strong>")
                .style('left', (d3.event.pageX)+'px')
                .style('top', (d3.event.pageY-40)+'px');

            d3.select(this)
                .style('stroke-width', 3);


            d3.selectAll('.cat'+d.catid).selectAll('circle')
                .attr('r', 3.5)
                .attr('fill', 'white')
                .attr('stroke-width', 2);

        })
        .on('mouseout', function(d){
            tooltip.transition()
                .style('opacity', 0);

            d3.select(this)
                .style('stroke-width', 1);

            d3.selectAll('.cat'+d.catid).selectAll('circle')
                .attr('r', 2)
                .attr('fill', function(d){return catColor[d.catid-1];})
                .attr('stroke-width', 0);
        });




    lines.selectAll("path").attr('d', function(d){return monthLine(d.val);});

    drawDots(drawData);

    var pointerline=lineSvg.append("rect")
        .attr("class", "line")
        .attr("width", 1)
        .attr("height", height)
        .attr('fill', 'gray')
        .attr('transform', 'translate('+ -margin.left +', '+ margin.top +')');

    function mousemove() {
        pointerline.attr('x', d3.event.pageX+17);
    }
}


function drawDots(drawData){
    var lines = lineSvg.selectAll('circle').remove();
    lines = lineSvg.selectAll('g.circle').data(drawData);
    lines.enter().append('g')
        .attr('class', function(d){return 'cat'+d.catid;})
        .attr('fill', function(d){return catColor[d.catid-1];})
        .attr('stroke', function(d){return catColor[d.catid-1];})
        .attr('stroke-width', 0)
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')');

    lines.selectAll('circle').data(function(d){return d.val;})
        .enter().append('circle')
        .attr('cx', function(d){return xScale(getYearMonth.parse(d.yearmonth));})
        .attr('cy', function(d){return yScale(d.n);})
        .attr('r', 2)
        .on('mouseover', function(d, i){
            d3.select(this)
                .attr('r', 5);

            linePointTip.show(d);
        })
        .on('mouseout', function(d){
            linePointTip.hide(d);

            d3.select(this)
                .attr('r', 2);
        });
}


function drawBar_year(){
    currentView=2;
    var drawData=getDrawData_bar(data_year);

    updateScale_year(drawData);
    updateAxes();

    drawData=drawData.splice(0, drawData.length-1);

    clear();

    var yearbar=lineSvg.selectAll('.year').data(drawData)
        .enter().append('g')
        .attr('class', 'g')
        .attr("transform", function(d) { console.log(d.year); console.log(xScale(d.year)+margin.left);return "translate(" + (xScale(d.year)+margin.left) + ","+ margin.top +")"; });

    yearbar.selectAll("rect")
        .data(function(d) { return d.val; })
        .enter().append("rect")
        .attr("class", function(d){return "cat"+d.catid;})
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.catname); })
        .attr("y", function(d) { return yScale(d.n); })
        .attr("height", function(d) { return height - yScale(d.n); })
        .attr('fill', function(d){return catColor[d.catid-1];})
        .on('mouseover', function(d){
            barTip.show(d);
        })
        .on('mouseout', function(d){
            barTip.hide(d);
        });
}


function updateScale_all(){
    dateRange=[new Date("2300-01-01"), new Date("1800-01-01")];
    valRange=[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

    for(var x=0; x<showStatus.length; x++){

        if(showStatus[x]==1){
            var c_dateRange=d3.extent(data_accumulate[x].val, function(d){
                return getDate.parse(d.date);
            });
            var c_valRange=d3.extent(data_accumulate[x].val, function(d){
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
}


function updateScale_month(){
    dateRange=[new Date("2300-01"), new Date("1800-01")];
    valRange=[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

    for(var x=0; x<showStatus.length; x++){

        if(showStatus[x]==1){
            var c_dateRange=d3.extent(data_monthly[x].val, function(d){
                return getYearMonth.parse(d.yearmonth);
            });
            var c_valRange=d3.extent(data_monthly[x].val, function(d){
                return d.n;
            });

            if(c_valRange[0]<valRange[0]) valRange[0]=c_valRange[0];
            if(c_valRange[1]>valRange[1]) valRange[1]=c_valRange[1];
            if(c_dateRange[0]<dateRange[0]) dateRange[0]=c_dateRange[0];
            if(c_dateRange[1]>dateRange[1]) dateRange[1]=c_dateRange[1];
        }
    }

    xScale=d3.time.scale().domain([dateRange[0], dateRange[1]]).range([0, width]);
    yScale=d3.scale.linear().domain([valRange[0], valRange[1]]).range([height, 0]);
}


function updateScale_year(data){
    dateRange=[2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];
    valRange=[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

    xScale=d3.scale.ordinal().domain(dateRange).rangeRoundBands([0, width], .1);
    x1.domain(data[data.length-1].catnamelist).rangeRoundBands([0, xScale.rangeBand()]);
    yScale=d3.scale.linear().domain([0, data[data.length-1].maxval]).range([height, 0]);
}


function getDrawData(data){
    var drawData=[];

    for(var i=0; i<showStatus.length; i++){
        if(showStatus[i]==1) drawData.push(data[i]);
    }

    return drawData;
}


function getDrawData_bar(data){
    var drawData=[];
    var maxVal=0;
    var dic={};

    for(var i=0; i<data.length; i++){
        dic.year=parseInt(data[i].year);
        var lis=[];
        for(var j=0; j<showStatus.length; j++){
            if(showStatus[j]==1){
                lis.push({'catname': catNameList[j].catname, 'catid': catNameList[j].catid, 'n': data[i].val[j], 'year': parseInt(data[i].year)});
                if(data[i].val[j]>maxVal) maxVal=data[i].val[j];
            }
        }
        dic.val=lis;
        drawData.push(dic);
        dic={};
    }

    var catnamelist=[];
    for(var i=0; i<showStatus.length; i++){
        if(showStatus[i]==1) catnamelist.push(catNameList[i].catname);
    }
    dic.catnamelist=catnamelist;
    dic.maxval=maxVal;
    drawData.push(dic);

    return drawData;

}


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
    var lines=d3.select('#line-chart').transition();

    xAxis.scale(xScale);
    lines.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);

    yAxis.scale(yScale);
    lines.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
}

function clear(){
    lineSvg.selectAll('rect').remove();
    lineSvg.selectAll('circle').remove();
    lineSvg.selectAll('g.lines').remove();
}
