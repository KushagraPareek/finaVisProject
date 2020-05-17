

width_comp4  = width - margin.right;
height_comp4 = height/2 - margin.bottom;


var svg_time_series = d3.select( "#time_series" )
    .append( "svg" )
    .attr("id","ny_time_series")
    .attr( "width", width_comp4  + margin.left + margin.right)
    .attr( "height",height_comp4 + margin.top + margin.bottom);

var color_comp4 = d3.scaleOrdinal(d3.schemeCategory10);

var g_time_series = svg_time_series.append("g")
                                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var line_tooltip = d3.select("#time_series")
                    .append("div")
                    .attr("class","tooltip")
                    .style("background-color", "black")
                    .style("color", "white")
                    .style("border-radius", "5px")
                    .style("padding", "10px");


var xRange = d3.scaleTime()
        .rangeRound([0, width_comp4]);

var yRange = d3.scaleLinear()
    .range([height_comp4, 0]);


var valueline = d3.line()
    .x(function(d) { return xRange(parseTime(d[0])); })
    .y(function(d) { return yRange(d[1]); });


var valueline2 = d3.line()
    .x(function(d) { return xRange(parseTime(d[0])); })
    .y(function(d) { return yRange(d[2]); });


function get_data_positive(d){

  return "Date: "+d[0]+"<br>"+
         "Cases: "+d[1]+"<br>";
}


function get_data_test(d){

  return "Date: "+d[0]+"<br>"+
         "Tests: "+d[2]+"<br>";
}

function appendScales(){

g_time_series.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," +height_comp4 + ")")
      .call(d3.axisBottom(xRange).ticks(7))
      .style("text-anchor", "middle")
      .attr("dx", "-.1em");

g_time_series.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yRange).ticks(5))
      .append("text")
      .attr("x",2)
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .text("Number of");


}


function appendDomain(data){
 date = []
 temp = []
 
 data.forEach(function(item,index){

     date.push(parseTime(data[index][0]))
     temp.push(data[index][1])
     temp.push(data[index][2])

 });


xRange.domain(d3.extent(date, function(d) { return d; }));
yRange.domain([0, d3.max(temp)]);


}



function appendLine(data){

  g_time_series.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline)


 g_time_series.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "steelblue")
      .attr("d", valueline2)
    
 g_time_series.selectAll("dot")	
        .data(data)			
        .enter().append("circle")
        .attr("class","anchors")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xRange(parseTime(d[0])); })		 
        .attr("cy", function(d) { return yRange(d[1]); }) 
        .style("opacity",0)
        .style("fill","red")
        .on("mouseover", function(d){
               d3.select(this).style("opacity",1);
               showTooltip(line_tooltip,get_data_positive(d));
            })
        .on("mousemove", function(d){
               moveTooltip(line_tooltip);
            })
        .on("mouseleave", function(d){
               d3.select(this).style("opacity",0);
               hideTooltip(line_tooltip);
            }); 

  g_time_series.selectAll("dot")	
        .data(data)			
        .enter().append("circle")
        .attr("class","anchors")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xRange(parseTime(d[0])); })		 
        .attr("cy", function(d) { return yRange(d[2]); }) 
        .style("opacity",0)
        .style("fill","steelblue")
        .on("mouseover", function(d){
               d3.select(this).style("opacity",1);
               showTooltip(line_tooltip,get_data_test(d));
               
            })
        .on("mousemove", function(d){
               moveTooltip(line_tooltip);
            })
        .on("mouseleave", function(d){
               d3.select(this).style("opacity",0);
               hideTooltip(line_tooltip);
            }); 

}


function plotTimeSeries(data){


   remover(g_time_series);

   graph = JSON.parse(data);
   data  = graph.time_data;

   appendDomain(data);
   appendLine(data);
   appendScales(); 

}
