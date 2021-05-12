// Stupid Example for Mockup:
// Source: https://stackoverflow.com/questions/18250263/draw-circles-using-d3

var dataset = [],
index = 0;

for(index=0; index<5; index++){
    dataset.push(Math.round(Math.random()*100));
}        

var sampleSVG = d3.select("#viz")
    .append("svg")
    .attr("width", 400)
    .attr("height", 400);    

    sampleSVG.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
    .style("stroke", "gray")
    .style("fill", "black")
    .attr("r", 100)
    .attr("cx", 200)
    .attr("cy", 150);