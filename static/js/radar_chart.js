// helper function to unpack data from object
function unpack_county_data(data, county){
    let countydata = data[county]
    countydata = JSON.parse(countydata)[0]
    return countydata
}

$.get('/radardata', function(fetched)
  {
    data = JSON.parse(fetched)
    
    // unpacking data according to counties selected
    let county1 = unpack_county_data(data, 'county1')
    let county2 = unpack_county_data(data, 'county2')
    let county3 = unpack_county_data(data, 'county3')

    let features = d3.keys(county1)
    features.shift();
    features.shift();

    console.log(county1)
    console.log(county2)
    console.log(county3)
    console.log(features)

    generate_radar(county1, county2, county3, features)
})

// function to generate radar chart
function generate_radar(county1, county2, county3, features){
    //setting the svg
    let svg2 = d3.select("#radar").append("svg")
        .attr("width", 800)
        .attr("height", 800);
    console.log("svg created")
    console.log(svg2)
    // setting the radial scale
    let radialScale = d3.scaleLinear()
    .domain([0,1])
    .range([0,250]);
    let ticks = [0.2,0.4,0.6,0.8,1.0];

    //set circles
    ticks.forEach(t =>
    svg2.append("circle")
    .attr("cx", 300)
    .attr("cy", 300)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("r", radialScale(t)));

    //setting tick labels
    ticks.forEach(t =>
        svg2.append("text")
        .attr("x", 305)
        .attr("y", 300 - radialScale(t))
        .text(t.toString())
    );
    
    //calculating the angle coordinates

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
      //  console.log("angle to coordinates: ",x,", ",y)
        return {"x": 300 + x, "y": 300 - y};
    }


    for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 1);
        let label_coordinate = angleToCoordinate(angle, 1.5);

        console.log("feature name: ", ft_name, "coords: ", label_coordinate)

   // console.log("axis line coordinates: ", line_coordinate)

    //draw axis line
    svg2.append("line")
    .attr("x1", 300)
    .attr("y1", 300)
    .attr("x2", line_coordinate.x)
    .attr("y2", line_coordinate.y)
    .attr("stroke","black");
    
    //draw axis label
    svg2.append("text")
    .attr("x", label_coordinate.x)
    .attr("y", label_coordinate.y)
    .text(ft_name);

}
    // function to draw a line from x to y point
    let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
    //colors for the data points
    let colors = ["blue", "yellow", "red"];

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

    for (var i = 0; i < data.length; i ++){
    let d = data[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);



    //draw the path element
    svg2.append("path")
    .datum(coordinates)
    .attr("d",line)
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.5);

    }
}

