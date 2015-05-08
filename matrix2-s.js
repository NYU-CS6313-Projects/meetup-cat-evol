// var margin = { top: 30, right: 30, bottom: 30, left:30 }
// var height = 400 - margin.top - margin.bottom,
//     width = 300 - margin.left - margin.right;

var matrixH = 400,
    matrixW = 250;


var dataset=[];

// for(var i=0; i<50; i++){
//     dataset.push(Math.round(Math.random()*10));
// }

// console.log(dataset);

var tooltip=d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'yellow')
        .style('opacity', 0);

var myMatrixSvg = d3.select('#matrix').append('svg')
        .attr('width', matrixW)
        .attr('height', matrixH);


function updateMatrix(){
    var filename="./data/cat-group-num-by-month.json";

    d3.json(filename, function(error, data){

        // d3.select("#title").html(function(d){
        //     return d.catname;
        // })

        if(error) return console.warn(error);
        console.log(data);


        // data.sort(function(a, b){
        //     if (a.yearmonth > b.yearmonth) return 1;
        //     if (a.yearmonth < b.yearmonth) return -1;
        //     return 0;
        // });

        var drawData=getDrawData(data);
        // alert();
        console.log(drawData);

        var baseIndexX=(parseInt(drawData[0].yearmonth.substring(4,6))-1)%12;
        console.log(baseIndexX);

        var maxval=d3.max(drawData, function(d, i){return parseInt(d.n);});
        console.log(maxval);

        // var colors=d3.scale.linear()
        //     .domain([0, maxval])
        //     .range(['#FFFFFF','#0B0B61']);


        // var colors=d3.scale.linear()
        //     .domain([0, maxval])
        //     .range(['#FFFFFF',catColor[i]]);

        var colors=[];
        for(var i=0; i<catNameList.length; i++){
            var c=d3.scale.linear()
                .domain([0, maxval])
                .range(['#FFFFFF',catColor[i]]);
            colors.push(c);
        }



        // var matrix=myMatrixSvg.selectAll("rect").data(data);

        // if (matrix.empty()) matrix.remove();
        // console.log(myMatrixSvg.empty());

        // matrix.exit().remove();

        myMatrixSvg.select('text').remove();
        myMatrixSvg.selectAll('rect').remove();
        // myMatrixSvg.transition();

        // show title
        // myMatrixSvg.append('text')
        //     .attr('x', '5')
        //     .attr('y', '20')
        //     .text(catname)
        //     .attr("fill", "red");

        var matrix=myMatrixSvg.selectAll("rect").data(drawData).enter()
            .append("rect")
            .attr('fill', '#FDF6E3')
            .attr('width', "15")
            .attr('height', "15")
            .attr('x', function(d, i){
                // return (i%12)*17;
                // console.log(d.yearmonth.substring(4,6));
                // console.log(parseInt(d.yearmonth.substring(4,6))-1);
                return ((i+baseIndexX)%12)*17+2;
            })
            .attr('y', function(d, i){
                return Math.floor((i+baseIndexX)/12)*17+40;
            })
            .on('mouseover', function(d){
                tooltip.transition()
                    .style('opacity', .9);

                tooltip.html(d.catname+"</br>"+d.yearmonth+"</br>"+d.n)
                    .style('left', (d3.event.pageX)+'px')
                    .style('top', (d3.event.pageY)+'px');

                d3.select(this)
                    .style('stroke', 'red')
                    .style('stroke-width', 1);
            })
            .on('mouseout', function(d){
                tooltip.transition()
                    .style('opacity', 0);

                d3.select(this)
                    .style('stroke-width', 0);
            })
            .on('click', function(d){matrixMouseClick(d);});


        matrix.transition()
            .attr('fill', function(d){
                var ci=d.catid-1;
                if(ci<0) ci=0;
                return colors[ci](d.n);
            })
            .delay(function(d, i){return i;})
            .ease('cubic');


    })
}


function getDrawData(data){
    var result=[];
    for(var i=0; i<data.length; i++){
        var dic={};
        dic.yearmonth=data[i].yearmonth;
        dic.n=0;
        dic.catname="none";
        dic.catid=0;
        result.push(dic);
    }

    for(var i=0; i<showStatus.length; i++){
        if(showStatus[i]==1){
            for(var j=0; j<data.length; j++){
                if(result[j].n<data[j]['val'][i]){
                    result[j].n=data[j]['val'][i];
                    result[j].catname=catNameList[i]['catname'];
                    result[j].catid=(i+1);
                }
            }
        }
    }

    return result;
}


/*
var colors=d3.scale.linear()
    .domain([0, d3.max(dataset)])
    .range(['#FFFFFF','#0B0B61'])

myMatrixSvg.selectAll("rect").data(dataset)
    .enter().append("rect")
    .style('fill', colors)
    .attr("width", "15")
    .attr("height", "15")
    .attr("x", function(d, i){
        return (i%12)*17
    })
    .attr("y", function(d, i){
        return Math.floor(i/12)*17
    })
    .on('mouseover', function(d){
        tooltip.transition()
            .style('opacity', .9)

        tooltip.html(d)
            .style('left', (d3.event.pageX)+'px')
            .style('top', (d3.event.pageY-20)+'px')
    })
*/

// parse time
// d3.json("./testtime.json", function(error, data){
//     console.log(data);
//     var t=d3.time.format("%Y%m%d");
//     // var st=toString(data[0]);
//     console.log(t.parse(data[0]));
//     console.log(t.parse(data[1]));
// })
