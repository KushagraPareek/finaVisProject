var inputValue = null;
var month = ["March","April","May"]

var slider = d3.select("#slider").append("input")
               .attr("type","range").attr("min",0).attr("max",2).attr("step",1).attr("id","month")

// when the input range changes update the value 
d3.select("#slider").on("input", function() {
    update(+this.value);
});

// update function to be called on change of slider positon. use the inputValue for retrieval of data.
function update(value) {
    document.getElementById("range").innerHTML=month[value];
    inputValue = month[value];
    console.log("month selected:",inputValue)
}

//selecting the checkboxes
d3.selectAll("#checkbox").on("input", function(){
    update_map(this.value);
})

//update based on checkbox value
function update_map(value){
    console.log(value, "was selected")
}