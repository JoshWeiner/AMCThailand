var voteData = [];

d3.csv("data/US_County_Level_Presidential_Results_08-16.csv", function(d) { // updated dataset
    return {
	county : d.county,
	2015 : +d.rats_2015, // new field
	coffee2015 : +d.coffee_2015, // new field
	rats2016 : +d.rats_2016, // new field
	coffee2016 : + d.coffee_2016 // new field
    };
},function(error, rows) {
    ratData = rows;
    console.log(ratData);
    createVisualization();
});

function createVisualization(){
    
    //Width and height
    var w = 180;
    var h = 180;
    
    //Create SVG element
    var svg = d3.select("#main")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("style", "outline: thin solid black;");
    
    var circle = svg.selectAll("circle")
	.data(ratData)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
	    return d.rats2015; // new data field
	})
	.attr("cy", function(d) {
	    return d.coffee2015; // new data field
	})
	.attr("r", 5);
};

d3.select("#start").on("click", function() {
    circle
	.transition()
	.attr("cx", function(d) {
	    return d.rats2016;
	})
	.attr("cy", function(d) {
	    return d.coffee2016;
	})
});

d3.select("#reset").on("click", function() {
    circle
	.transition()
	.attr("cx", function(d) {
	    return d.rats2015;
	})
	.attr("cy", function(d) {
	    return d.coffee2015;
	})
});
