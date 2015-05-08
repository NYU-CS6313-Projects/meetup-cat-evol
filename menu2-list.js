var catColor=["#7D7426","#F84F1B","#28D8D5","#7DFFFE","#FB95B6","#9D9931","#F12ABF","#27EA88","#549AD5","#FEA526","#7B8D8B","#BB755F","#432E16",
"#D75CFB","#44E337","#51EBE3","#ED3D24","#4069AE","#E1CC72","#E33E88","#D8A3B3","#428B50","#66F3A3","#E28A2A","#B2594D","#609297","#E8F03F","#3D2241",
"#954EB3","#6A771C","#58AE2E","#75C5E9","#BBEB85","#6578E6","#A7DAB9","#932C5F","#865A26","#CC78B9","#2E5A52","#8C9D79","#9F6270","#6D3377","#551927","#DE8D5A",
"#E3DEA8","#C3C9DB","#3A5870","#5C9CCD","#CD3B4F","#E476E3","#DCAB94","#33386D","#4DA284","#817AA5","#8D8384","#624F49","#8E211F","#9E785B","#355C22","#D4ADDE",
"#A98229","#E88B87","#28282D","#253719","#BD89E1","#EB33D8","#6D311F","#DF45AA","#E86723","#6CE5BC","#765175","#942C42","#986CEB","#8CC488","#8395E3",
"#D96F98","#9E2F83","#CFCBB8","#4AB9B7","#E7AC2C","#E96D59","#929752","#5E54A9","#CCBA3F","#BD3CB8","#408A2C","#8AE32E","#5E5621","#ADD837","#BE3221","#8DA12E",
"#3BC58B","#6EE259","#52D170","#D2A867","#DB6472","#B9E8E0","#CDE067","#9C5615","#536C4F","#A74725","#CBD88A","#DF3066","#E9D235","#EE404C","#7DB362",
"#B1EDA3","#71D2E1","#A954DC","#91DF6E","#D64ADC"];
var bgColor='#FDF6E3';

var showStatus=[];
for(var cs=0; cs<35; cs++){
    showStatus[cs]=1;
}

var catNameList=[{"catname": "fine arts/culture", "catid": 1}, {"catname": "career/business", "catid": 2}, {"catname": "cars/motorcycles", "catid": 3}, {"catname": "community/environment", "catid": 4}, {"catname": "dancing", "catid": 5}, {"catname": "education/learning", "catid": 6}, {"catname": "", "catid": 7}, {"catname": "fashion/beauty", "catid": 8}, {"catname": "fitness", "catid": 9}, {"catname": "food/drink", "catid": 10}, {"catname": "games", "catid": 11}, {"catname": "LGBT", "catid": 12}, {"catname": "movements/politics", "catid": 13}, {"catname": "health/wellbeing", "catid": 14}, {"catname": "hobbies/crafts", "catid": 15}, {"catname": "language/ethnic identity", "catid": 16}, {"catname": "alternative lifestyle", "catid": 17}, {"catname": "literature/writing", "catid": 18}, {"catname": "", "catid": 19}, {"catname": "movies/film", "catid": 20}, {"catname": "music", "catid": 21}, {"catname": "new age/spirituality", "catid": 22}, {"catname": "outdoors/adventure", "catid": 23}, {"catname": "paranormal", "catid": 24}, {"catname": "parents/family", "catid": 25}, {"catname": "pets/animals", "catid": 26}, {"catname": "photography", "catid": 27}, {"catname": "religion/beliefs", "catid": 28}, {"catname": "sci-fi/fantasy", "catid": 29}, {"catname": "singles", "catid": 30}, {"catname": "socializing", "catid": 31}, {"catname": "sports/recreation", "catid": 32}, {"catname": "support", "catid": 33}, {"catname": "tech", "catid": 34}, {"catname": "women", "catid": 35}];

var menuH = 110,
    menuW = 1200;


d3.select('#title').html("Meetup Data");

function colorToggle(i){
    var setColor;
    if(showStatus[i]==1){
        setColor=bgColor;
        showStatus[i]=0;
    }
    else{
        setColor=catColor[i];
        showStatus[i]=1;
    }
    return setColor;
}

console.log(catColor);

d3.select("#select-btn").selectAll("g").data(["Unselect All", "Select All"]).enter()
    .append("g")
    .html(function(d, i) {
        return '<input type="button" value="' + d + '" onClick=\'javascript:setAll(' + i + ');\' >';
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
    .style('stroke-width', 0)
    .on('click', function(d){menuClick(d);});


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
    .on('click', function(d){menuClick(d);});

function menuClick(d){
    var setColor=colorToggle(d.catid-1);
    var setStroke=function(){
        if(showStatus[d.catid-1]==1) return 0;
        else return 1;
    }
    var select='rect.cat'+d.catid;
    console.log(select);
    d3.select(select)
        .style('fill', setColor)
        .style('stroke-width', setStroke);

    // oneLine(i+1);
    updateMatrix();
    updateLine();
    updateEventChart(d.catid, d.catname);
}


function setAll(status){
    if(status==0){
        for(var i=0; i<showStatus.length; i++){
            showStatus[i]=status;

            var select='rect.cat'+(i+1);
            d3.select(select)
                .style('fill', bgColor)
                .style('stroke-width', 1);

            var selectLine='path.cat'+(i+1);
            d3.select(selectLine)
                .style('stroke', '#E5E5E5');
        }
        updateMatrix();
    }
    else{
        for(var i=0; i<showStatus.length; i++){
            showStatus[i]=status;

            var select='rect.cat'+(i+1);
            d3.select(select)
                .style('fill', catColor[i])
                .style('stroke-width', 0);
        }

        updateMatrix();
        updateLine();
    }

    // updateMatrix();
    // updateLine();
}
