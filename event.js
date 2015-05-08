d3.select('#title').html("Meetup Data");

d3.json('./data/catname.json', function(error, data){
	if (error) {return console.warn(error)};

	d3.select("#eventMenu")
		.selectAll("g")
		.data(data)
		.enter().append("g").html(function(d, i){
			return '<input type="button" value="' + d + '" onClick=\'javascript:updateEventChart(' + (i+1) + ', "' + d + '");\' >'
		});
});
