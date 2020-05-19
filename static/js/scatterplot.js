// set the dimensions and margins of the graph
var margin = {top: 20, right: 120, bottom: 30, left: 60},
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
    let county = data[0].County
    plot(data, county)

 })


// When reading the csv, I must format variables:
function plotScatter(data){
    d3.selectAll("#scatt").remove()
    d3.selectAll(".legendscatter").remove()
    data = JSON.parse(data['data'])
   // console.log(data)
   let county = data[0].County
   console.log("county", county)
    plot(data, county)
}

    function plot(data, county){
        addLegendScatter(svg5, county)
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
        .attr("r",4)
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

    svg5.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left +15)
      .attr("x",0 - (height / 2))
      .attr("dy", "0.5em")
      .style("text-anchor", "middle")
      .text("case load"); 

    

}

function addLegendScatter(svg2, county)
{
    // adding the legend
    var legend;
    var legendobj ={}
    legendobj[county]= '#69b3a2'
    var legendnames = [county]

    //console.log("legendobj", legendobj)

    legend = svg2.selectAll(".legendscatter")
    .data(legendnames)
    .enter()
    .append("g")
    .attr("class","legendscatter")
    .attr("transform", function(d,i){
        return "translate(0,"+i*18+")";
    });

    legend.append("rect")
            .attr("x", width+20)
            .attr("width", 16)
            .attr("height", 16)
            .style("fill",function(d){ m = d; return legendobj[m] })
            .style("padding", 20)

    legend.append("text")
    .attr("x", width+40)
    .attr("y", 9)
    .attr("dy", ".30em")
    .style("text-anchor","start")
    .text(function(d){ return d;});
}
