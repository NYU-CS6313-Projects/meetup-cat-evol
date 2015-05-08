// var height = 800,
//     width = 30;

d3.select('#title').html("Meetup Data");

d3.json('./data/catname.json', function(error, data){
    if(error) return console.warn(error);
    console.log(data);

    d3.select("#menu").selectAll("g").data(data).enter()
        .append("g")
        .html(function(d, i) {
            return '<input type="button" value="' + d + '" onClick=\'javascript:updateMatrix(' + (i+1) + ', "' + d + '"); oneLine(' + (i+1) + ');\' >'
        });
});

// update(1);
