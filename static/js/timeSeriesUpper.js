var margin   = {top: 30, right: 60, bottom: 50, left: 60};

width_comp4_upper  = viewwidth - margin.right;
height_comp4_upper = viewheight/2 - margin.bottom;




var svg_time_series_upper = d3.select( "#time_series_upper" )
    .append( "svg" )
    .attr("id","ny_time_series_upper")
    .attr( "width", width_comp4_upper  + margin.left + margin.right)
    .attr( "height",(height_comp4_upper + margin.top + margin.bottom));
    


var g_time_series_upper = svg_time_series_upper.append("g")
                                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var xRange_upper = d3.scaleTime()
        .rangeRound([0, width_comp4_upper]);

var yRange_upper = d3.scaleLinear()
    .range([height_comp4_upper, 0]);


var line_tooltip_upper = d3.select("#time_series_upper")
                    .append("div")
                    .attr("class","tooltip")
                    .style("background-color", "black")
                    .style("color", "white")
                    .style("border-radius", "5px")
                    .style("padding", "10px");

var valueline_upper = d3.line()
    .x(function(d) { return xRange_upper(parseTime(d[0])); })
    .y(function(d) { return yRange_upper(d[1]); });


var valueline2_upper = d3.line()
    .x(function(d) { return xRange_upper(parseTime(d[0])); })
    .y(function(d) { return yRange_upper(d[2]); });


var parseTime = d3.timeParse("%m/%d/%Y");

function appendScales_upper(){

g_time_series_upper.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," +height_comp4_upper + ")")
      .call(d3.axisBottom(xRange_upper).ticks(7))
      .style("text-anchor", "middle")
      .attr("dx", "-.1em");

g_time_series_upper.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yRange_upper).ticks(5))
      .append("text")
      .attr("x",2)
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .text("Number of");


}


function appendDomain_upper(data){
 date = []
 temp = []
 
 data.forEach(function(item,index){

     date.push(parseTime(data[index][0]))
     temp.push(data[index][1])
     temp.push(data[index][2])

 });


xRange_upper.domain(d3.extent(date, function(d) { return d; }));
yRange_upper.domain([0, d3.max(temp)]);


}

function appendLine_upper(data){

  g_time_series_upper.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline_upper);

  
  g_time_series_upper.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "steelblue")
      .attr("d", valueline2_upper);


 g_time_series_upper.selectAll("dot")	
        .data(data)			
        .enter().append("circle")
        .attr("class","anchors")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xRange_upper(parseTime(d[0])); })		 
        .attr("cy", function(d) { return yRange_upper(d[1]); }) 
        .style("opacity",0)
        .style("fill","red")
        .on("mouseover", function(d){
               d3.select(this).style("opacity",1);
               showTooltip(line_tooltip_upper,get_data_positive(d));
            })
        .on("mousemove", function(d){
               moveTooltip(line_tooltip_upper);
            })
        .on("mouseleave", function(d){
               d3.select(this).style("opacity",0);
               hideTooltip(line_tooltip_upper);
            }); 

  g_time_series_upper.selectAll("dot")	
        .data(data)			
        .enter().append("circle")
        .attr("class","anchors")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xRange_upper(parseTime(d[0])); })		 
        .attr("cy", function(d) { return yRange_upper(d[2]); }) 
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

//adding legend
function addLegendTimeSeries(svg2)
{
    // adding the legend
    var legend;
    var legendobj ={}
    legendobj['Positive Cases']= 'red',
    legendobj['Total Tests Performed']= 'steelblue'
    var legendnames = ['Positive Cases', 'Total Tests Performed']

    //console.log("legendobj", legendobj)

    legend = svg2.selectAll(".legendtests")
    .data(legendnames)
    .enter()
    .append("g")
    .attr("class","legendtests")
    .attr("transform", function(d,i){
        return "translate(0,"+i*18+")";
    });

    legend.append("rect")
            .attr("x", width_comp4_upper-70)
            .attr("width", 16)
            .attr("height", 16)
            .style("fill",function(d){ m = d; return legendobj[m] })
            .style("padding", 20)

    legend.append("text")
    .attr("x", width_comp4_upper-50)
    .attr("y", 9)
    .attr("dy", ".30em")
    .style("text-anchor","start")
    .text(function(d){ return d;});
}



function plotTimeSeries_upper(data){

   remover(g_time_series_upper);

   graph = JSON.parse(data);
   data  = graph.time_data;

   appendDomain_upper(data);
   appendLine_upper(data);
   appendScales_upper(); 
   addLegendTimeSeries(svg_time_series_upper)
}
