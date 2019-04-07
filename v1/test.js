var files = ["us.json", "US_County_Level_Presidential_Results.csv"];
var promises = [];

files.forEach(function(url) {
    promises.push(d3.json(url))
});

Promise.all(promises).then(function(values) {
    console.log(values)
});
