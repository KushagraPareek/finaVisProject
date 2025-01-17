var startMonth = 'April';
var initMap    =  false;
var type_map   = "positive";
var selectedCounty = 'Bronx';
var set_radar = false;
var selected_counties_name = []
var selectedObjects = []


window.onload = function() {
  initMap = false;
  colorpleth(startMonth);
  getTimeSeries(startMonth,selectedCounty);
  getTimeSeries_Full(selectedCounty);
  compareCounties();
  
};


var color_map = d3.scaleQuantile()
          .range(["#ffeee6","#ffeee6","#ffede5","#ffece4","#ffece3","#ffebe2","#feeae1","#fee9e0","#fee9de","#fee8dd","#fee7dc","#fee6db","#fee6da","#fee5d9","#fee4d8","#fee3d7","#fee2d6","#fee2d5","#fee1d4","#fee0d2","#fedfd1","#feded0","#feddcf","#fedccd","#fedbcc","#fedacb","#fed9ca","#fed8c8","#fed7c7","#fdd6c6","#fdd5c4","#fdd4c3","#fdd3c1","#fdd2c0","#fdd1bf","#fdd0bd","#fdcfbc","#fdceba","#fdcdb9","#fdccb7","#fdcbb6","#fdc9b4","#fdc8b3","#fdc7b2","#fdc6b0","#fdc5af","#fdc4ad","#fdc2ac","#fdc1aa","#fdc0a8","#fcbfa7","#fcbea5","#fcbca4","#fcbba2","#fcbaa1","#fcb99f","#fcb89e","#fcb69c","#fcb59b","#fcb499","#fcb398","#fcb196","#fcb095","#fcaf94","#fcae92","#fcac91","#fcab8f","#fcaa8e","#fca98c","#fca78b","#fca689","#fca588","#fca486","#fca285","#fca183","#fca082","#fc9e81","#fc9d7f","#fc9c7e","#fc9b7c","#fc997b","#fc987a","#fc9778","#fc9677","#fc9475","#fc9374","#fc9273","#fc9071","#fc8f70","#fc8e6f","#fc8d6d","#fc8b6c","#fc8a6b","#fc8969","#fc8868","#fc8667","#fc8565","#fc8464","#fb8263","#fb8162","#fb8060","#fb7f5f","#fb7d5e","#fb7c5d","#fb7b5b","#fb795a","#fb7859","#fb7758","#fb7657","#fb7455","#fa7354","#fa7253","#fa7052","#fa6f51","#fa6e50","#fa6c4e","#f96b4d","#f96a4c","#f9684b","#f9674a","#f96549","#f86448","#f86347","#f86146","#f86045","#f75e44","#f75d43","#f75c42","#f65a41","#f65940","#f6573f","#f5563e","#f5553d","#f4533c","#f4523b","#f4503a","#f34f39","#f34e38","#f24c37","#f24b37","#f14936","#f14835","#f04734","#ef4533","#ef4433","#ee4332","#ed4131","#ed4030","#ec3f2f","#eb3d2f","#eb3c2e","#ea3b2d","#e93a2d","#e8382c","#e7372b","#e6362b","#e6352a","#e5342a","#e43229","#e33128","#e23028","#e12f27","#e02e27","#df2d26","#de2c26","#dd2b25","#dc2a25","#db2924","#da2824","#d92723","#d72623","#d62522","#d52422","#d42321","#d32221","#d22121","#d12020","#d01f20","#ce1f1f","#cd1e1f","#cc1d1f","#cb1d1e","#ca1c1e","#c91b1e","#c71b1d","#c61a1d","#c5191d","#c4191c","#c3181c","#c2181c","#c0171b","#bf171b","#be161b","#bd161a","#bb151a","#ba151a","#b91419","#b81419","#b61419","#b51319","#b41318","#b21218","#b11218","#b01218","#ae1117","#ad1117","#ac1117","#aa1017","#a91016","#a71016","#a60f16","#a40f16","#a30e15","#a10e15","#a00e15","#9e0d15","#9c0d14","#9b0c14","#990c14","#970c14","#960b13","#940b13","#920a13","#900a13","#8f0a12","#8d0912","#8b0912","#890812","#870811","#860711","#840711","#820711","#800610","#7e0610","#7c0510","#7a0510","#78040f","#76040f","#75030f","#73030f","#71020e",
                      "#6f020e","#6d010e","#6b010e","#69000d","#67000d"]);


color_map.domain([0,30000]);


var color_map_test = d3.scaleQuantile()
          .range(["#f3f8fe","#f2f8fd","#f2f7fd","#f1f7fd","#f0f6fd","#eff6fc","#eef5fc","#eef5fc","#edf4fc","#ecf4fb","#ebf3fb","#eaf3fb","#eaf2fb","#e9f2fa","#e8f1fa","#e7f1fa","#e7f0fa","#e6f0f9","#e5eff9","#e4eff9","#e3eef9","#e3eef8","#e2edf8","#e1edf8","#e0ecf8","#e0ecf7","#dfebf7","#deebf7","#ddeaf7","#ddeaf6","#dce9f6","#dbe9f6","#dae8f6","#d9e8f5","#d9e7f5","#d8e7f5","#d7e6f5","#d6e6f4","#d6e5f4","#d5e5f4","#d4e4f4","#d3e4f3","#d2e3f3","#d2e3f3","#d1e2f3","#d0e2f2","#cfe1f2","#cee1f2","#cde0f1","#cce0f1","#ccdff1","#cbdff1","#cadef0","#c9def0","#c8ddf0","#c7ddef","#c6dcef","#c5dcef","#c4dbee","#c3dbee","#c2daee","#c1daed","#c0d9ed","#bfd9ec","#bed8ec","#bdd8ec","#bcd7eb","#bbd7eb","#b9d6eb","#b8d5ea","#b7d5ea","#b6d4e9","#b5d4e9","#b4d3e9","#b2d3e8","#b1d2e8","#b0d1e7","#afd1e7","#add0e7","#acd0e6","#abcfe6","#a9cfe5","#a8cee5","#a7cde5","#a5cde4","#a4cce4","#a3cbe3","#a1cbe3","#a0cae3","#9ec9e2","#9dc9e2","#9cc8e1","#9ac7e1","#99c6e1","#97c6e0","#96c5e0","#94c4df","#93c3df","#91c3df","#90c2de","#8ec1de","#8dc0de","#8bc0dd","#8abfdd","#88bedc","#87bddc","#85bcdc","#84bbdb","#82bbdb","#81badb","#7fb9da","#7eb8da","#7cb7d9","#7bb6d9","#79b5d9","#78b5d8","#76b4d8","#75b3d7","#73b2d7","#72b1d7","#70b0d6","#6fafd6","#6daed5","#6caed5","#6badd5","#69acd4","#68abd4","#66aad3","#65a9d3","#63a8d2","#62a7d2","#61a7d1","#5fa6d1","#5ea5d0","#5da4d0","#5ba3d0","#5aa2cf","#59a1cf","#57a0ce","#569fce","#559ecd","#549ecd","#529dcc","#519ccc","#509bcb","#4f9acb","#4d99ca","#4c98ca","#4b97c9","#4a96c9","#4895c8","#4794c8","#4693c7","#4592c7","#4492c6","#4391c6","#4190c5","#408fc4","#3f8ec4","#3e8dc3","#3d8cc3","#3c8bc2","#3b8ac2","#3a89c1","#3988c1","#3787c0","#3686c0","#3585bf","#3484bf","#3383be","#3282bd","#3181bd","#3080bc","#2f7fbc","#2e7ebb","#2d7dbb","#2c7cba","#2b7bb9","#2a7ab9","#2979b8","#2878b8","#2777b7","#2676b6","#2574b6","#2473b5","#2372b4","#2371b4","#2270b3","#216fb3","#206eb2","#1f6db1","#1e6cb0","#1d6bb0","#1c6aaf","#1c69ae","#1b68ae","#1a67ad","#1966ac","#1865ab","#1864aa","#1763aa","#1662a9","#1561a8","#1560a7","#145fa6","#135ea5","#135da4","#125ca4","#115ba3","#115aa2","#1059a1","#1058a0","#0f579f","#0e569e","#0e559d","#0e549c","#0d539a","#0d5299","#0c5198","#0c5097","#0b4f96","#0b4e95","#0b4d93","#0b4c92","#0a4b91","#0a4a90","#0a498e","#0a488d","#09478c","#09468a","#094589","#094487","#094386","#094285","#094183","#084082","#083e80","#083d7f","#083c7d","#083b7c","#083a7a","#083979","#083877","#083776"
,"#083674","#083573","#083471","#083370","#08326e","#08316d","#08306b"]);

color_map_test.domain([0,80000]);


var svg_main_map = d3.select( "#main_map" )
    .append( "svg" )
    .attr("id","ny_map")
    .attr( "width", viewwidth)
    .attr( "height", viewheight);

var group_main_map = svg_main_map.append( "g" );



var albersProjection = d3.geoAlbers()
    .scale( viewwidth*6)
    .rotate( [75.527,0] )
    .center( [0,42.954] )
    .translate( [viewwidth/2,viewheight/2] );

var geoPath = d3.geoPath()
    .projection( albersProjection );

var inputValue = null;
var month = ["March","April","May"];



var map_tooltip = d3.select("#main_map")
                    .append("div")
                    .attr("class","tooltip")
                    .style("background-color", "black")
                    .style("color", "white")
                    .style("border-radius", "5px")
                    .style("padding-left", "30px");

d3.select("#slider").on("input", function() {
    update(+this.value);
});

function setChecked(){

 if(set_radar == false){

    set_radar = true;
  }
 else{
    set_radar = false;
    clear_selected();
  }

}
function clear_selected(){

    
    for(let i=0;i<selectedObjects.length;i++){
       
         d3.select(selectedObjects[i])
           .attr("stroke-width","0.75");
    }

    selected_counties_name.length = 0;
    selectedObjects.length = 0;
    
} 

function update(value) {
    document.getElementById("month").innerHTML=month[value];
    inputValue = month[value];
    startMonth = inputValue;
    colorpleth(inputValue)
    getTimeSeries(startMonth,selectedCounty)
}


d3.select("#dimensions").on("change", function(){
      let form = document.getElementById("dimensions")
      for(let i=0; i<form.length; i++){
            if(form[i].checked){
               type_map = form[i].id;
        }}
      
       if(type_map == "positive"){
          updateMap_cases()
          document.getElementById("month").style.color ="red";
          
       }else{
          updateMap_tests()
          document.getElementById("month").style.color ="blue";
          
       }
  });

function integrateData(data){

    graph = JSON.parse(data);
    data  = graph.county_data;
    
    for(let i = 0; i< counties_json.features.length; i++){

           let county = counties_json.features[i].properties.name;

           for(let j = 0; j< data.length; j++){

               if(county == data[j][0]){
                  counties_json.features[i].properties.positive_cases = data[j][1];
                  counties_json.features[i].properties.total_test = data[j][2];
               }
           
         }
     }

  if(initMap == false){ 
          createMap_cases()
   }else{
         
       if(type_map == "positive"){
          updateMap_cases()
       }else{
          updateMap_tests()
       }
   } 

}

function getData_map(d){

  return  "County: "+d.properties.name+"<br>"+
          "Cases: "+d.properties.positive_cases+"<br>"+
          "Tests: "+d.properties.total_test+"<br>";

}

function createMap_cases(){
 

   group_main_map.selectAll( "path" )
    .data( counties_json.features )
    .enter()
    .append("path")
    .attr("stroke","#342e2e")
    .attr("stroke-width","0.75")
    .attr( "d", geoPath )
    .attr("pointer-events", "all")
    .attr("fill", function(d){
            
            let value = d.properties.positive_cases;
            return color_map(value);
            

          })
     
     .on("mouseover", function(d){
               showTooltip(map_tooltip,getData_map(d));
            })
     .on("mousemove", function(d){
               moveTooltip(map_tooltip);
            })
     .on("mouseleave", function(d){
               hideTooltip(map_tooltip);
            })
     .on("click", function(d,i){
            selectedCounty = d.properties.name;

            if(set_radar == true){
              

               d3.select(this).attr("stroke-width","4");
               selected_counties_name.push(d.properties.name);
               selectedObjects.push(this);

               if(selected_counties_name.length == 3){
                    
                  
                    //call radar function from here
                    getRadarData(selected_counties_name);
                    trasitionOnSelection(selected_counties_name);
                    clear_selected();
               }
            }
            else{
               getTimeSeries_Full(d.properties.name);
               getTimeSeries(startMonth,d.properties.name);
               getScatterPlot(d.properties.name);
            }
        });


       
   
    initMap = true;
}


function updateMap_cases(){
 

   group_main_map.selectAll( "path" )
    .data( counties_json.features )
    .transition()
    .duration(1200)
    .attr("fill", function(d){
            
            let value = d.properties.positive_cases;
            return color_map(value);
            

          });
   

}


function updateMap_tests(){
 

   group_main_map.selectAll( "path" )
    .data( counties_json.features )
    .transition()
    .duration(1200)
    .attr("fill", function(d){
            
            let value = d.properties.total_test;
            return color_map_test(value);
            

          });
   

}


function colorpleth(month){

$.post("/colorpleth",{'month':month},function(data){
 
    integrateData(data);
    
        
 });
   
}


function getTimeSeries(month,county){

$.post("/timeData",{'month':month,'county':county},function(data){
 
    plotTimeSeries(data)
  

 });

}

function getTimeSeries_Full(county){

$.post("/timeDataFull",{'county':county},function(data){
 
    plotTimeSeries_upper(data)

 });

}


function compareCounties(){

$.post("/compareCounties",function(data){
 
  
   plotHorizontalBar(data);
   

 });

}
function getScatterPlot(county){
   $.post("/scatterdata", {'county': county}, function(data){
      plotScatter(data)
   })
}
function getRadarData(selected_counties_name){
  

   $.ajax({
      type: "POST",
      url: "radar",
      data: JSON.stringify({ selected_counties_name } ),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
     //     alert(JSON.stringify(data));
          plot_radar(data)
      }
  });
      
}
