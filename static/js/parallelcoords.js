
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#parallelc")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/KushagraPareek/finaVisProject/master/static/data/ParallelCoordsData.csv?token=AF677XNTYTS2KZC24JIRCC26ZD3PW", function(data) {
    console.log(d3.keys(data[0]))
    dimensions = ["TotalBeds","TotalHospitals","TotalPositives","TotalTests"]
  // Color scale: give me a specie name, I return a color
  var color = "black"
  // Here I set the list of dimension manually to control the order of axis:

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d){ return +d[name]; }) ) 
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // Highlight the specie that is hovered
//   var highlight = function(d){

//     selected_specie = d.Species

//     // first every group turns grey
//     d3.selectAll(".line")
//       .transition().duration(200)
//       .style("stroke", "lightgrey")
//       .style("opacity", "0.2")
//     // Second the hovered specie takes its color
//     d3.selectAll("." + selected_specie)
//       .transition().duration(200)
//       .style("stroke", color(selected_specie))
//       .style("opacity", "1")
//   }

  // Unhighlight
//   var doNotHighlight = function(d){
//     d3.selectAll(".line")
//       .transition().duration(200).delay(1000)
//       .style("stroke", function(d){ return( color(d.Species))} )
//       .style("opacity", "1")
//   }

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
      .attr("class", function (d) { return "line " + d.County } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", color)
      .style("opacity", 0.5)
  //    .on("mouseover", highlight)
  //    .on("mouseleave", doNotHighlight )

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

})
