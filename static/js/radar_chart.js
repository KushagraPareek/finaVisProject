// helper function to unpack data from object
function unpack_county_data(data, county){
    let countydata = data[county]
    countydata = JSON.parse(countydata)[0]
    return countydata
}

let colors = ["blue", "#82E0AA", "#E74C3C"];

//console.log("variables: ",height, width)

$.get('/radardata', function(fetched)
  {
    data = JSON.parse(fetched)

    // unpacking data according to counties selected
    let county1 = unpack_county_data(data, 'county1')
    let county2 = unpack_county_data(data, 'county2')
    let county3 = unpack_county_data(data, 'county3')

    let counties_selected = []
    counties_selected.push(county1['County'])
    counties_selected.push(county2['County'])
    counties_selected.push(county3['County'])

    console.log(counties_selected)

    let features = d3.keys(county1)
    features.shift();
    features.shift();

    //console.log(county1)
    //console.log(county2)
    //console.log(county3)
    //console.log(features)

    generate_radar(county1, county2, county3, features, counties_selected)
})

//console.log("variables: ",height, width)
height = height/2 //window height/2
width = height //width = height as we require a square.
// function to generate radar chart
function generate_radar(county1, county2, county3, features, counties_selected){
    //setting the svg
    let svg2 = d3.select("#radar").append("svg")
        .attr("width", 2*width+20)
        .attr("height", 2*height+5);
    //console.log("svg created")
    //console.log(svg2)
    // setting the radial scale
    let radialScale = d3.scaleLinear()
    .domain([0,1])
    .range([0,(height-50)]);
    let ticks = [0.2,0.4,0.6,0.8,1.0];

    //console.log("height:",height, "width", width)
    //set circles
    ticks.forEach(t =>
    svg2.append("circle")
    .attr("cx", width)
    .attr("cy", height)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("r", radialScale(t)));

    //setting tick labels
    ticks.forEach(t =>
        svg2.append("text")
        .attr("x", (width)+5)
        .attr("y", ((height) - radialScale(t)))
        .text(t.toString())
    );
    
    //calculating the angle coordinates
    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
      //  console.log("angle to coordinates: ",x,", ",y)
        return {"x": (width) + x, "y": (height)- y};
    }
  


    for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 1.0);
        let label_coordinate = angleToCoordinate(angle, 1.15);

        console.log("feature name: ", ft_name, "coords: ", label_coordinate)

   // console.log("axis line coordinates: ", line_coordinate)

    //draw axis line
    svg2.append("line")
    .attr("x1", (width))
    .attr("y1", (height))
    .attr("x2", line_coordinate.x)
    .attr("y2", line_coordinate.y)
    .attr("stroke","black");
    
    //draw axis label
    svg2.append("text")
    .attr("x", label_coordinate.x-50)
    .attr("y", label_coordinate.y+10)
    .text(ft_name);

}
    // function to draw a line from x to y point
    let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
    //colors for the data points

    plot_county(county1, 0, 0.4)
    plot_county(county2, 1, 0.3)
    plot_county(county3, 2, 0.3)
    function plot_county(county, i, opacity)
    {
        //function to retrieve coordinates from the data points
        function getPathCoordinates(data_point){
            let coordinates = [];
            for (var i = 0; i < features.length; i++){
                let ft_name = features[i];
                let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
            }
            return coordinates;
        }   

        let d = county
        let color = colors[i];
        console.log("color ar ",i, color)
        let coordinates = getPathCoordinates(d);
    
        //draw the path element
        var polygon = svg2.append("path")
        .datum(coordinates)
        .attr("d",line)
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", opacity);

        // adding hover effect
        polygon.on("mouseover", function(d) { console.log("on mouse over", i); d3.select(this).attr("opacity",1)})
        //restoring back to normal
        polygon.on("mouseout", function(d) { console.log("on mouse over", i); d3.select(this).attr("opacity",opacity)})

        console.log(coordinates)

        for(let j= 0; j < coordinates.length; j++){
            //console.log(coordinates[j])
            draw_points(coordinates[j])
        }
        //appending circles at the points on axes
        function draw_points(coordinate){
            //console.log(coordinate)
                svg2.append("circle")
                .datum(coordinate)
                .attr("cx", function(d){ return d.x})
                .attr("cy", function(d){ return d.y})
                .attr("r", 6)
                .attr("fill", color)
            }
    }
    addLegend(svg2, counties_selected)
}



function addLegend(svg2, counties_selected)
{
    // adding the legend
    var legend;
    var legendobj ={}
    legendobj[counties_selected[0]]= colors[0],
    legendobj[counties_selected[1]]= colors[1], 
    legendobj[counties_selected[2]]= colors[2]
    var legendnames = [counties_selected[0],counties_selected[1], counties_selected[2]]

    //console.log("legendobj", legendobj)

    legend = svg2.selectAll(".legend")
    .data(legendnames)
    .enter()
    .append("g")
    .attr("class","legend")
    .attr("transform", function(d,i){
        return "translate(0,"+i*18+")";
    });

    legend.append("rect")
            .attr("x", 2*width-70)
            .attr("width", 16)
            .attr("height", 16)
            .style("fill",function(d){ m = d; return legendobj[m] })
            .style("padding", 20)

    legend.append("text")
    .attr("x", 2*width-50)
    .attr("y", 9)
    .attr("dy", ".30em")
    .style("text-anchor","start")
    .text(function(d){ return d;});
}


