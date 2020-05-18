
var selected_county = [];
var margin_bar = {top: 20, right: 20, bottom: 30, left: 65},
    width_bar  =  viewwidth - margin_bar.left - margin_bar.right,
    height_bar =  viewheight - margin_bar.top - margin_bar.bottom;


var color_matcher = ["magenta", "#82E0AA", "#E74C3C"];

var y = d3.scaleBand()
          .range([height_bar, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width_bar]);
          

var svg_bar = d3.select("#graphic").append("svg")
    .attr("width", width_bar + margin_bar.left + margin_bar.right)
    .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin_bar.left + "," + margin_bar.top + ")");


function appendBar_domain(data){
  
 county = []
 caseLoad = []
 
 data.forEach(function(item,index){

     county.push(data[index][0])
     caseLoad.push(data[index][1])

 });
 
  x.domain([0, d3.max(caseLoad)])
  y.domain(county);

} 

function append_rectangles(data){
  svg_bar.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("id",function(d){return d[0]; })
      .attr("width", function(d) {return x(d[1]); } )
      .attr("y", function(d) { return y(d[0]); })
      .attr("height", y.bandwidth());


   
  svg_bar.append("g")
      .attr("transform", "translate(0," + height_bar + ")")
      .call(d3.axisBottom(x));

 
  svg_bar.append("g")
      .call(d3.axisLeft(y).tickValues(y.domain().filter(function(d,i){ return !(i%10)})));


 svg_bar.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin_bar.left + 10 )
      .attr("x",0 - (height_bar / 3))
      .attr("dy", "0.5em")
      .style("text-anchor", "middle")
      .text("county"); 


 svg_bar.append("text")             
      .attr("transform",
            "translate(" + (width_bar/2) + " ," + 
                           (height_bar+ margin_bar.top +10) + ")")
      .style("text-anchor", "middle")
      .text("Case Load");

 
}

function trasitionOnSelection(counties){

   clearSelection();
   for(let i=0;i<counties.length;i++){
     
      if(counties[i].includes("Lawrence")==true){
          
          counties[i] = "Lawrence";
      }

      selected_county.push(counties[i]);
      let bar = d3.select("#"+counties[i]);
       
       bar.transition()
      .style('fill',color_matcher[i]);
  }

}

function clearSelection(){

  for(let i=0;i<selected_county.length;i++){
     
  
      let bar = d3.select("#"+selected_county[i]);
       
       bar.transition()
       .style('fill',"steelblue");
  }


   selected_county.length = 0;

}

function plotHorizontalBar(data){

  graph = JSON.parse(data);
  data  = graph.time_data;

  data.sort(function(a, b) {
        return a[1] - b[1]
      });
  
  appendBar_domain(data);
  append_rectangles(data);
  
}
