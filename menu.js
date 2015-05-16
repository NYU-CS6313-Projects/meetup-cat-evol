var catColor=["#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3",
    "#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#2ca02c","#FDF6E3","#FDF6E3","#FDF6E3",
    "#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3",
    "#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3","#FDF6E3"];
var bgColor='#FDF6E3';

var showStatus=[];
for(var cs=0; cs<35; cs++){
    showStatus[cs]=0;
    if(cs==16) showStatus[cs]=1;
}

var currentView=0;

var maxSelect_num=4;
var currentSelect_num=1;

var colorStack=["#F84F1B", "#1f77b4", "#ff7f0e"];

var catNameList=[{"catname": "fine arts/culture", "catid": 1}, {"catname": "career/business", "catid": 2}, {"catname": "cars/motorcycles", "catid": 3}, {"catname": "community/environment", "catid": 4}, {"catname": "dancing", "catid": 5}, {"catname": "education/learning", "catid": 6}, {"catname": "", "catid": 7}, {"catname": "fashion/beauty", "catid": 8}, {"catname": "fitness", "catid": 9}, {"catname": "food/drink", "catid": 10}, {"catname": "games", "catid": 11}, {"catname": "LGBT", "catid": 12}, {"catname": "movements/politics", "catid": 13}, {"catname": "health/wellbeing", "catid": 14}, {"catname": "hobbies/crafts", "catid": 15}, {"catname": "language/ethnic identity", "catid": 16}, {"catname": "alternative lifestyle", "catid": 17}, {"catname": "literature/writing", "catid": 18}, {"catname": "", "catid": 19}, {"catname": "movies/film", "catid": 20}, {"catname": "music", "catid": 21}, {"catname": "new age/spirituality", "catid": 22}, {"catname": "outdoors/adventure", "catid": 23}, {"catname": "paranormal", "catid": 24}, {"catname": "parents/family", "catid": 25}, {"catname": "pets/animals", "catid": 26}, {"catname": "photography", "catid": 27}, {"catname": "religion/beliefs", "catid": 28}, {"catname": "sci-fi/fantasy", "catid": 29}, {"catname": "singles", "catid": 30}, {"catname": "socializing", "catid": 31}, {"catname": "sports/recreation", "catid": 32}, {"catname": "support", "catid": 33}, {"catname": "tech", "catid": 34}, {"catname": "women", "catid": 35}];

var menuH = 110,
    menuW = 1200;


d3.select('#title').html("Meetup Category Evolution");

function colorToggle(i){
    var setColor;
    if(showStatus[i]==1){
        setColor=bgColor;
        colorStack.push(catColor[i]);
        showStatus[i]=0;
        currentSelect_num--;
    }
    else{
        catColor[i]=colorStack.pop();
        setColor=catColor[i];
        showStatus[i]=1;
        currentSelect_num++;
    }
    // console.log("select #: "+currentSelect_num);
    return setColor;
}


d3.select("#select-btn").selectAll("g").data(["Unselect All", "Select All"]).enter()
    .append("g")
    .html(function(d, i) {
        return '<input type="button" value="' + d + '" onClick=\'javascript:setAll(' + i + ');\' >';
    });

var viewBtn=[{"name":"Accumulative View", "func":"drawLine_all()"},
    {"name":"Monthly View", "func":"drawLine_month()"},
    {"name":"Yearly View", "func":"drawBar_year()"}];
d3.select("#view-btn").selectAll("g").data(viewBtn).enter()
    .append("g")
    .html(function(d, i) {
        return '<input type="button" value="' + d.name + '" onClick=\'javascript:'+d.func+';\' >';
    });

var menuSvg = d3.select('#menu').append('svg')
    .attr('width', menuW)
    .attr('height', menuH);

menuSvg.selectAll("rect").data(catNameList).enter()
    .append("rect")
    .filter(function(d){return d.catname!="";})
    .attr('class', function(d, i){return 'cat'+(d.catid).toString();})
    .attr('fill', function(d, i){
        return catColor[d.catid-1];
        // return colorToggle(d.catid-1);
    })
    .attr('width', "15")
    .attr('height', "15")
    .attr('x', function(d, i){
        return i%7*170+10;
    })
    .attr('y', function(d, i){
        return Math.floor(i/7)*20+10;
    })
    .style('stroke', '#E5E5E5')
    .style('stroke-width', 1)
    .on('click', function(d){menuClick(d);})
    .on('mouseover', function(d){
        var selectLine='path.cat'+d.catid;
        d3.select(selectLine)
            .style('stroke-width', 3);

        d3.selectAll('.cat'+d.catid).selectAll('circle')
            .attr('r', 3.5)
            .attr('fill', 'white')
            .attr('stroke-width', 2);
    })
    .on('mouseout', function(d){
        var selectLine='path.cat'+d.catid;
        d3.select(selectLine)
            .style('stroke-width', 1);

        d3.selectAll('.cat'+d.catid).selectAll('circle')
            .attr('r', 2)
            .attr('fill', function(d){return catColor[d.catid-1];})
            .attr('stroke-width', 0);
    });


menuSvg.selectAll("text").data(catNameList).enter()
    .append('text')
    .filter(function(d){return d.catname!="";})
    .attr('class', function(d, i){return 'cat'+(d.catid).toString();})
    .attr('x', function(d, i){
        return i%7*170+27;
    })
    .attr('y', function(d, i){
        return Math.floor(i/7)*20+22;
    })
    .attr('font-size', '12px')
    .text(function(d){return d.catname;})
    .on('click', function(d){menuClick(d);})
    .on('mouseover', function(d){
        var selectLine='path.cat'+d.catid;
        d3.select(selectLine)
            .style('stroke-width', 3);

        d3.selectAll('.cat'+d.catid).selectAll('circle')
            .attr('r', 3.5)
            .attr('fill', 'white')
            .attr('stroke-width', 2);
    })
    .on('mouseout', function(d){
        var selectLine='path.cat'+d.catid;
        d3.select(selectLine)
            .style('stroke-width', 1);

        d3.selectAll('.cat'+d.catid).selectAll('circle')
            .attr('r', 2)
            .attr('fill', function(d){return catColor[d.catid-1];})
            .attr('stroke-width', 0);
    });

updateEventChart();

function menuClick(d){
    if(currentSelect_num==maxSelect_num && showStatus[d.catid-1]==0){
        alert("Unable to select: reaching the maximum selection 4!");
    }
    else{
        var setColor=colorToggle(d.catid-1);
        var setStroke=function(){
            if(showStatus[d.catid-1]==1) return 0;
            else return 1;
        }
        var select='rect.cat'+d.catid;
        // console.log(select);
        d3.select(select)
            .style('fill', setColor)
            .style('stroke-width', setStroke);

        if(currentView==0){
            drawLine_all();
            updateEventChart(d.catid, d.catname);
        }
        else if(currentView==1){
            drawLine_month();
            updateEventChart(d.catid, d.catname);
        }
        else if(currentView==2){
            drawBar_year();
            updateEventChart(d.catid, d.catname);
        }
    }

}
