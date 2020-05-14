var width = 350;
var height = 300;


var svg = d3.select( "#main_map" )
    .append( "svg" )
    .attr("id","ny_map")
    .attr( "width", width )
    .attr( "height", height );


var g = svg.append( "g" );



var albersProjection = d3.geoAlbers()
    .scale( 3000 )
    .rotate( [75.527,0] )
    .center( [0,42.954] )
    .translate( [width/2,height/2] );


var geoPath = d3.geoPath()
    .projection( albersProjection );



g.selectAll( "path" )
    .data( counties_json.features )
    .enter()
    .append( "path" )
    .attr( "fill", "#ccc" )
    .attr( "stroke", "#333")
    .attr( "d", geoPath )
    .attr( "class", "incident")
    .on("mouseover", function(d){
		d3.select("h6").text(d.properties.name);
		d3.select(this).attr("class","incident hover");
	})
	.on("mouseout", function(d){
		d3.select("h6").text("");
		d3.select(this).attr("class","incident");
	});
