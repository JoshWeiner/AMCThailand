// {top: 20, right: 20, bottom: 50, left: 30}
var margin = {top: 30, right: 20, bottom: 50, left: 50},
	width = 0.95*window.innerWidth - margin.left - margin.right,
	height = 0.9*window.innerHeight - margin.top - margin.bottom;
//Globals:
var currentSearch = "";
var searchTerms = "";
var selection = "county";
var year;
var cache = {};

var weburls = {
	'county': 'https://raw.githubusercontent.com/psthomas/election-vis/master/US_County_Level_Presidential_Results_04-16.csv',
	'state': 'https://raw.githubusercontent.com/psthomas/election-vis/master/US_State_Level_Presidential_Results_04-16.csv',
	'demographic': 'https://raw.githubusercontent.com/psthomas/election-vis/master/US_Demographic_Presidential_Results_04-16.csv'
}
var urls = weburls;
//var urls = locurls;
//Formatting Functions
var pctFormat = d3.format(".2%");
var thsdFormat = d3.format(",");


//Create SVG
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//Year Title
var title = svg.append("text")
    .attr("class", "title")
    .attr("dy", height-10)
    .attr("dx", ".35em");
var demtext = svg.append("text")
    .attr("class", "party")
    .attr("dy", height-50)
    .attr("dx", 243);
var reptext = svg.append("text")
    .attr("class", "party")
    .attr("dy", height-14)
    .attr("dx", 243);
//Define static scales
var xScale = d3.scaleLinear()
	.domain([-100, 100])
	.range([0, width]);
var yScale = d3.scaleLinear()
	.domain([0, 100])
	.range([height, 0]);
//Base the color scale on the democratic margin.
var colorScale = d3.scaleLinear()
	.domain([-80, 0, 80])
	.range(['#EF3B2C', '#885ead', '#08519C'])
	.interpolate(d3.interpolateRgb);
//Define x, y axes
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
//Append Axes
svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
	.attr("y", "3em")
	.attr("x", width/2)
	.text("Democratic Margin (%)");
svg.append("g")
	.attr("class", "axis")
	.call(yAxis)
	.attr("transform", "translate(" + (width/2) + ",0)")
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "-3.75em")
	.style("text-anchor", "end")
	.text("Turnout (%VAP)");

// Helper functions:
function getYearData(dataset, year) {
	for (var i=0; i<dataset.length; i++) {
		if (Number(dataset[i].key) === year) {
			return dataset[i].values;
		}
	}
}
function copyObj(original) {
	return JSON.parse(JSON.stringify(original));
}
// d3.select('#searchform').onSubmit( function() {
// 	handleClick();
// 	return false;
// });
function reset() {
	document.getElementById("myVal").value= '';
	handleClick();
}

function renderCounties() {
	if (cache.counties) {
		build(cache.counties);
	} else {
		d3.csv(urls.county, parseRows, function(error, data) {
			if (error) {throw error};
			//Update cache:
			cache.counties = data;
			build(data);
		});
	}
	function parseRows(d) {
		return {'county': d.county_name + ', ' + d.state, 'state': d.state, 'county_num': +d.county_num, 'turnout': +d.turnout,
			   'num_rep': +d.rep_num, 'num_dem': +d.dem_num, 'year': +d.year, 'state_electoral_votes': +d.state_electoral_votes,
			   'vap': +d.vap, 'id': +d.fips_code, 'dem_margin': +d.dem_margin*100};
	}

	function build(data) {
		// Build state data sums
		var stateData = d3.nest()
			.key(function(d) { return d.year; })
			.key(function(d) { return d.state; })
			.rollup(function(v) { return {
				'num_state': d3.sum(v, function(d) { return d.county_num; }),
				'num_state_dem': d3.sum(v, function(d) { return d.num_dem; }),
				'num_state_rep': d3.sum(v, function(d) { return d.num_rep; }),
			}; })
			.object(data);
		// Add the state level data to each county object
		data.forEach(function(d) {
			d.num_state = stateData[d.year][d.state]['num_state'],
			d.num_state_dem = stateData[d.year][d.state]['num_state_dem'],
			d.num_state_rep = stateData[d.year][d.state]['num_state_rep']
		});
		var dataset = d3.nest()
			.key(function(d) { return +d.year; })
			.sortValues(function(a,b) { return b.county_num - a.county_num; } )  //Bring smallest to front
			.object(data);
			//.entries(data);
		var years = Object.keys(dataset).map(Number);
		years.sort()
		year = year ? year : years[0];
		//Create a copy, so it can be edited on drag:
		//var yearData = Object.assign([], getYearData(dataset, year));
		//var yearData = copyObj(getYearData(dataset, year));
		var yearData = copyObj(dataset[String(year)]);
		//Data is just array of all objects from csv, used to find max of all years
		var rScale = d3.scaleLinear()
			.domain([0, d3.max(data, function(d) {return Math.sqrt(d.county_num/Math.PI); })])  //Area proportional to votes
			.range([1, 35]);  //2,60  2, 30
		var rScale_electoral = d3.scaleLinear()
			.domain([0, d3.max(data, function(d) {
				return Math.sqrt((d.county_num/d.num_state)*d.state_electoral_votes/Math.PI);  //Area proportional to electoral votes
			})])
			.range([1, 35]);
		var rScale_vpi = d3.scaleLinear()
			.domain([0, d3.max(data, function(d) {
				var county_vpi = (d.county_num/d.num_state) * (d.state_electoral_votes/(Math.abs(d.num_state_dem-d.num_state_rep)));
				// Using VAP instead
				//var county_vpi = (d.vap/d.num_state) * (d.state_electoral_votes/(Math.abs(d.num_state_dem-d.num_state_rep)));
				return Math.sqrt(county_vpi/Math.PI);   //Area proportional to VPI
			})])
			.range([1, 35]);  //2,60  2, 30
		function upclick() {
			year += 4;
			if (year > years[years.length - 1]) {
				year = years[0]
			}
			//Assign to new object, update circles:
			getYearData(dataset, year);
			//yearData = Object.assign([], getYearData(dataset, year));
			yearData = copyObj(dataset[String(year)]);
			update(yearData, year);
		}
		function getRadioScaled(d) {
			var checked = document.querySelector('input[name="area"]:checked').value;
			if (checked === "electoral") {
				return rScale_electoral(Math.sqrt((d.county_num/d.num_state)*d.state_electoral_votes/Math.PI));
				// d.county_num Math.pow(d.county_num, 0.6)  Math.sqrt(d.county_num/Math.PI)  Math.sqrt(d *4/Math.PI)
			} else if (checked === "vpi") {
				//voter power index:
				//http://www.dailykos.com/story/2016/12/19/1612252/-Voter-Power-Index-Just
				//-How-Much-Does-the-Electoral-College-Distort-the-Value-of-Your-Vote
				// Using county_num
				var county_vpi = (d.county_num/d.num_state) * (d.state_electoral_votes/(Math.abs(d.num_state_dem-d.num_state_rep)));
				// using VAP:
				//var county_vpi = (d.vap/d.num_state) * (d.state_electoral_votes/(Math.abs(d.num_state_dem-d.num_state_rep)));
				return rScale_vpi(Math.sqrt(county_vpi/Math.PI));
			} else {
				//Area proportional to number of voters
				return rScale(Math.sqrt(d.county_num/Math.PI));
			}
		}

		function updateScore(yearData) {
			//Could get this data directly from dataframe,
			//but want to calculate so can be updated easily on drag.
			var sums = [0,0,0];
			var electoral_sums = [[],0,0];
			for (var i=0; i<yearData.length; i++) {
				sums[0] += yearData[i].num_dem;
				sums[1] += yearData[i].num_rep;
				sums[2] += yearData[i].county_num;
				//Sum up electoral votes for each unique state
			}
			// console.log(yearData);
			var states = [];
			var stateYearData = yearData.filter( function(current) {
				//console.log(current);
				//return states.indexOf(current.state)
				if (states.indexOf(current.state) === -1) {
					states.push(current.state);
					return true;
				}
				return false;
			});
			for (var i = 0; i<stateYearData.length; i++) {
				var stateName = stateYearData[i].state;
				var currentYear = stateYearData[i].year;
				if (currentYear === 2016 && ['ME','NE'].indexOf(stateName) !== -1) {     //['ME','NE'].indexOf(stateName) !== -1  (stateName === 'ME' || stateName === 'NE')
					//console.log('entered');
					//Handle split states
					// electoral_sums[1] += 3; // ME + NB
					// electoral_sums[2] += 6; // ME + NB
					//Will be entered twice, so give 1.5, 3 each entrance instead:
					electoral_sums[1] += 1.5; // ME + NB
					electoral_sums[2] += 3; // ME + NB
					//electoral_sums[0].push(stateName === 'ME' ? 'NE' : 'ME'); //Make sure both states are added
					//electoral_sums[0] = electoral_sums[0].concat(['ME','NE']);
				} else if (currentYear === 2008 && stateName === 'NE' ) {
					electoral_sums[1] += 1;
					electoral_sums[2] += 4;
				} else if (stateYearData[i].num_state_dem > stateYearData[i].num_state_rep ) {
					//electoral_sums[1] is dems
					electoral_sums[1] += stateYearData[i].state_electoral_votes;
				} else {
					electoral_sums[2] += stateYearData[i].state_electoral_votes;
				}
			}
			var dfrac = sums[0]/sums[2],
				rfrac = sums[1]/sums[2];
			//update dfrac rfrac text, update color background
			demtext.text('D ' + pctFormat(dfrac) + ' ' + electoral_sums[1])
			reptext.text('R ' + pctFormat(rfrac) + ' ' + electoral_sums[2])
			if (electoral_sums[1] > electoral_sums[2]) {
				demtext.style('fill', '#bbb');
				reptext.style('fill', null);
			} else {
				demtext.style('fill', null);
				reptext.style('fill', '#bbb');
			}
			//Optional, set background color based on winner
			// var backColor = dfrac > rfrac ? colorScale(5) : colorScale(-5);
			// //var backColor = colorScale((dfrac-rfrac)*100);
			// d3.selectAll('svg')
			// 	.style('background-color', backColor);
		}

		function initialize(yearData, year) {
			//Change D,R scores:
			updateScore(yearData);
			//Update title
			title.text(year);
			var circles = svg.selectAll("circle")
				.data(yearData, function(d) { return d.id ; });  // Key for object constancy: https://bost.ocks.org/mike/constancy/
			circles.exit().remove();
			//Create any new circles
			circles.enter().append("circle")
				.attr("class", "circle")
				.attr("cx", function(d) {
					return xScale(((d.num_dem-d.num_rep)/d.county_num)*100);
				})
				.attr("cy", function(d) {
					return yScale(d.turnout*100);
				})
				.attr("r", function(d) {
					//return rScale(Math.sqrt(d.county_num/Math.PI));
					return getRadioScaled(d);
				})
				.attr("fill",function(d){
					if (d.county.search(searchTerms) != -1) {
						return colorScale(((d.num_dem-d.num_rep)/d.county_num)*100);
					}else {
						return "rgba(192,192,192,0.05)";
					}
				})
				.call(drag)
				.on("mouseover", tooltipOn)
				.on("mouseout", function(d){return tooltip.style("visibility", "hidden");});
		}
		//Initialize scatterplot
		initialize(yearData, year);
		//update(yearData, year);  //Works, but transition is weird.
	} //);
}

renderCounties();
