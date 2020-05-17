var viewportWidth =  window.screen.width;
var viewportHeight = window.screen.height;
var width = viewportWidth *0.45;
var height = width/1.75;


function remover(svg){

 svg.selectAll("*").remove();

}

function showTooltip(tooltip,data){

    tooltip.transition()
           .duration(100)
           .style("opacity", 0.6);

    tooltip.html(data)
           .style("left", (d3.event.pageX-40) + "px")
           .style("top", (d3.event.pageY-90) + "px");

}

function moveTooltip(tooltip){

   tooltip.style("left", (d3.event.pageX-40) + "px")
          .style("top", (d3.event.pageY-90) + "px");

}

function hideTooltip(tooltip){

   tooltip.transition()
          .duration(100)
          .style("opacity", 0);

}
