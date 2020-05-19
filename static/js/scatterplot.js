// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = viewwidth - margin.left - margin.right,
    height = viewheight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg5 = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          //Read the data
console.log("parsing data time:,",parseTime('05/11/2019'))

//default: plot New York County


  // When reading the csv, I must format variables:
function plotScatter(data){
    data = JSON.parse(data['data'])
    console.log(data)

    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return parseTime(d.date); }))
      .range([ 0, width ]);
    svg5.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    console.log()
    var y = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.CaseLoad; }))
      .range([ height, 0 ]);
    svg5.append("g")
      .call(d3.axisLeft(y));

    // // Add the line
    svg5.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .curve(d3.curveBasis) 
        .x(function(d) { return x(parseTime(d.date))})
        .y(function(d) { return y(d.CaseLoad) })
        )

    var Tooltip = d3.select("#scatter")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      function tooltip_data(d){

        return "Date: "+(d.date)+"<br>"+
               "Case Load: "+d.CaseLoad+"<br>";
      }
    // Add the points
    svg5
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(parseTime(d.date)) } )
        .attr("cy", function(d) { return y(d.CaseLoad) } )
        .attr("r", 2)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", function(d){
            d3.select(this).style("opacity",1);
            showTooltip(line_tooltip,(tooltip_data(d)));
         })
     .on("mousemove", function(d){
            moveTooltip(line_tooltip);
         })
     .on("mouseleave", function(d){
          //  d3.select(this).style("opacity",0);
            hideTooltip(line_tooltip);
         }); 

}