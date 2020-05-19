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

//default: plot New York County
$.post("/scatterdata", {'county': 'New York'}, function(data){
 //   console.log(['data'])
    var jsondata = JSON.parse(data['data'])
 //   console.log(jsondata)
    data = jsondata
    
    plot(data)

 })


// When reading the csv, I must format variables:
function plotScatter(data){
    d3.selectAll("#scatt").remove()
    data = JSON.parse(data['data'])
   // console.log(data)
    plot(data)
}

    function plot(data){
    // // Add the line
    //setting the axes once
    var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return parseTime(d.date); }))
    .range([ 0, width ]);

    var xaxis = svg5.append("g")
    .attr("id","scatt")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    xaxis.transition().duration(2000)

    var y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.CaseLoad; }))
    .range([ height, 0 ]);
    
    var yaxis = svg5.append("g").attr("id","scatt")
    .call(d3.axisLeft(y));
    
    yaxis.transition().duration(2000)

  //  console.log("data in plot", data[0].date)
    svg5.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("id", "scatt")
      .attr("d", d3.line()
        .curve(d3.curveBasis) 
        .x(function(d) { return  x(parseTime(d.date))})
        .y(function(d) { return y(d.CaseLoad) })
        )

    // var Tooltip = d3.select("#scatter")
    //   .append("div")
    //   .style("opacity", 0)
    //   .attr("class", "tooltip")
    //   .style("background-color", "white")
    //   .style("border", "solid")
    //   .style("border-width", "2px")
    //   .style("border-radius", "5px")
    //   .style("padding", "5px")

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
        .attr("id", "scatt")
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