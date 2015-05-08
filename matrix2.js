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
        .style('opacity', 0)

var myMatrixSvg = d3.select('#matrix').append('svg')
        .attr('width', matrixW)
        .attr('height', matrixH)

function updateMatrix(cat, catname){
    var filename="./data/cat-m/cat"+cat.toString()+".json";

    d3.json(filename, function(error, data){

        // d3.select("#title").html(function(d){
        //     return d.catname;
        // })

        if(error) return console.warn(error);
        //console.log(data);


        data.sort(function(a, b){
            if (a.yearmonth > b.yearmonth) return 1;
            if (a.yearmonth < b.yearmonth) return -1;
            return 0;
        });

        console.log(data);

        var maxval=d3.max(data, function(d, i){return parseInt(d.n);});
        console.log(maxval);

        var colors=d3.scale.linear()
            .domain([0, maxval])
            .range(['#FFFFFF','#0B0B61'])


        myMatrixSvg.select('text').remove();
        myMatrixSvg.selectAll('rect').remove();
        // myMatrixSvg.transition();

        myMatrixSvg.append('text')
            .attr('x', '5')
            .attr('y', '20')
            .text(catname)
            .attr("fill", "red");

        var matrix=myMatrixSvg.selectAll("rect").data(data).enter()
            .append("rect")
            .attr('fill', '#FDF6E3')
            .attr('width', "15")
            .attr('height', "15")
            .attr('x', function(d, i){
                return (i%12)*17;
            })
            .attr('y', function(d, i){
                return Math.floor(i/12)*17+40;
            })
            .on('mouseover', function(d){
                tooltip.transition()
                    .style('opacity', .9);

                tooltip.html(d.yearmonth+"</br>"+d.n)
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
            });

        matrix.transition()
            .attr('fill', function(d){return colors(d.n);})
            .delay(function(d, i){return i;})
            .ease('cubic');


    })
}



