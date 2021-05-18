// SOURCE: Adapted from Dianaow’s Block 0da76b59a7dffe24abcfa55d5b9e163e
// https://bl.ocks.org/dianaow/0da76b59a7dffe24abcfa55d5b9e163e 

// SET GLOBAL VARIABLES FOR THE CHART
var glines2
var mouseG2
var tooltip2

var parseDate2 = d3.timeParse("%Y-%m-%d")

var margin2 = {top: 50, right: 100, bottom: 50, left: 200}
var width2 = 900 - margin2.left - margin2.right
var height2 = 450 - margin2.top - margin2.bottom

var lineOpacity2 = 1
var lineStroke2 = "2px"

var axisPad2 = 6 // axis formatting
var R2 = 6 //legend marker

// Declare tooltip2 first
var tooltip2 = d3.select("#viz")
            .append("div")
            .attr('id', 'tooltip2')
            .style('position', 'absolute')
            .style("background-color", "#D3D3D3")
            .style('display', 'block')

// SVG should be a global variable if we want axes to update
// Source for responsive axes: https://www.d3-graph-gallery.com/graph/scatter_buttonXlim.html
var svg2 = d3.select("#viz")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append('g')
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// In general, any element we want to update should be globally set

var yScale2 = d3.scaleLinear()
var xScale2 = d3.scaleTime()
var color2 = d3.scaleOrdinal()

var yAxis2
var xAxis2

var svgLegend2 = svg2.append('g')
      .attr('class', 'gLegend')
      .attr("transform", "translate(" + (width2 + 20) + "," + 0 + ")")

var legend2


// START OF D3 CSV CHART FUNCTION
d3.csv("data/output/reshaped_country_data.csv", data => {

  var res = data.map((d,i) => {
    return {
      date : parseDate2(d.Year),
      Year : +d.Year_num,
      Location : d.Location,
      Parameter : d.Parameter,
      Time : +d.Time,
      Group : d.Group,
      Manip1 : d.Manip1,
      Manip2 : d.Manip2,
      Metric : d.Metric, 
      Value : +d.Value
    }
  })
  

  // Set some intial variables: line generator, x and y-Scales

  xScale2.domain(d3.extent(res, d=>d.date))
    .range([0, width2])

  yScale2.domain([d3.min(res, d => d.Value), d3.max(res, d => d.Value)])
    .range([height2, 0]);

 var line2 = d3.line()
    .x(d => xScale2(d.date))
    .y(d => yScale2(d.Value))


// FUNCTIONS TO RENDER INITIAL CHART HERE: 

// SET DEFAULT PARAMETERS HERE
  renderChart("CO2", "1965", "1", "Absolute", "Population") // inital chart render (set default to choice of default data)


// FUNCTION TO INITIATE CHART WITH RADIO BUTTON
  function renderChart(Parameter, Time, Group, Manip1, Manip2) {

    // Implement Filters: 
    var res1 = res.filter(d=>d.Parameter == Parameter)
    var res2 = res1.filter(d=>d.Time == parseInt(Time))

    var res3 = res2.filter(function (d) { return d.Group.match(Group); })
    var res4 = res3.filter(d=>d.Manip1 == Manip1)
    var resNew = res4.filter(d=>d.Manip2 == Manip2)

  // Y-Axis Label Variables
    var parameter_label 
        if (Parameter == "CO2") { parameter_label =  "CO2"
        } else{ parameter_label =  "Energy"}

    var manip1_label 
        if (Manip1 == "Growth") { manip1_label =  ", Growth (%)"
        } else{ manip1_label =  ", (Twh)"}

    var manip2_label 
        if (Manip2 == "Population") { manip2_label =  " per Capita"
        } else if(Manip2 == "GDP") { manip2_label =  " per GDP"
        } else{manip2_label = ""}

    var y_axis_label = parameter_label + manip2_label + manip1_label

    // necessary to nest data so that keys represent each category
    var res_nested = d3.nest() 
      .key(d=>d.Location)
      .entries(resNew)

    // APPEND COLOR AXIS //
    var category = d3.map(resNew, function(d){return d.Location;}).keys()
    color2.domain(category).range(d3.schemePaired)


    // CREATE LEGEND // 
    legend2 = svgLegend2.selectAll('.legend2')
          .data(category)
          .enter().append('g')
            .attr("class", "legend2")
            .attr("transform", function (d, i) {return "translate(0," + i * 20 + ")"})

    legend2.append("circle")
          .attr("class", "legend-node")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", R2)
          .style("fill", d=>color2(d))

    legend2.append("text")
          .attr("class", "legend-text")
          .attr("x", R2*2)
          .attr("y", R2/2)
          .style("fill", "#A9A9A9")
          .style("font-size", 12)
          .text(d=>d)


    // APPEND MULTIPLE LINES //
    var lines2 = svg2.append('g')
      .attr('class', 'lines')

    glines2 = lines2.selectAll('.line-group')
      .data(res_nested).enter()
      .append('g')
      .attr('class', 'line-group')

    glines2  
      .append('path')
        .attr('class', 'line')  
        .attr('d', d => line2(d.values))
        .style('stroke', d => {
      return color2(d.key)
    })
        .style('fill', 'none')
        .style('opacity', lineOpacity2)
        .style('stroke-width', lineStroke2)
    

    // APPEND Y AXIS //
    yScale2.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

    yAxis2 = svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale2).ticks(10, "s").tickSize(-width2))
        .call(g => {
              g.selectAll("text")
              .style("text-anchor", "middle")
              .attr("x", -axisPad2*2)
              .attr('fill', '#A9A9A9')

              g.selectAll("line2")
                .attr('stroke', '#A9A9A9')
                .attr('stroke-width', 0.7) // make horizontal tick thinner and lighter so that line paths can stand out
                .attr('opacity', 0.3)

              g.select(".domain").remove()

            })

      
    // APPEND X AXIS //
    xScale2.domain(d3.extent(resNew, d=>d.date))

    xAxis2 = svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height2})`)
      .call(d3.axisBottom(xScale2))
      .call(g => {
          var years = xScale2.ticks(d3.timeYear.every(1))
          var xshift = (width2/(years.length))/2 
          g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
            .style("text-anchor", "middle")
            .attr("y", axisPad2)
            .attr('fill', '#A9A9A9')

          g.selectAll("line2")
            .attr('stroke', '#A9A9A9')

          g.select(".domain")
            .attr('stroke', '#A9A9A9')

      }) 


// APPEND AXIS TITLES //
    // X AXIS
    svg2.append("text")
      .attr("class", "x_label")
      .attr("text-anchor", "end")
      .attr("x", width2)
      .attr("y", height2 + 35)
      .attr("fill", "white")
      .attr("weight", "white")
      .text("Years");
      
    
      // Y AXIS
      svg2.append("text")
      .attr("class", "y_label")
      .attr("text-anchor", "end")
      .attr("y", -45)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .attr("fill", "white")
      .text(y_axis_label);



// CREATE HOVER tooltip2 WITH VERTICAL LINE //
    mouseG2 = svg2.append("g")
      .attr("class", "mouse-over-effects");

    mouseG2.append("path") // create vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#A9A9A9")
      .style("stroke-width", lineStroke2)
      // .style("opacity", "0");

    var lines = document.getElementsByClassName('line2');

    var mousePerLine = mouseG2.selectAll('.mouse-per-line')
      .data(res_nested)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", function (d) {
        return color2(d.key)
      })
      .style("fill", "none")
      .style("stroke-width", lineStroke2)
      .style("opacity", "0");

    mouseG2.append('svg2:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width2) 
      .attr('height', height2)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () { // on mouse out hide line, circles and text
        // d3.select(".mouse-line")
        //   .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
        // d3.selectAll("#tooltip2")
        //   .style('display', 'none')

      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        // d3.selectAll("#tooltip2")
        //   .style('display', 'block')
      })
      .on('mousemove', function () { // update tooltip2 content, line, circles and text when mouse moves
        var mouse = d3.mouse(this)

        d3.selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {
            var xDate = xScale2.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
            var bisect = d3.bisector(function (d) { return d.date; }).left // retrieve row index of date on parsed csv
            var idx = bisect(d.values, xDate);

            d3.select(".mouse-line")
              .attr("d", function () {
                var data = "M" + xScale2(d.values[idx].date) + "," + (height2);
                data += " " + xScale2(d.values[idx].date) + "," + 0;
                return data;
              });
            return "translate(" + xScale2(d.values[idx].date) + "," + yScale2(d.values[idx].Value) + ")";

          });

        updateTooltipContent(mouse, res_nested, color2)

      })


    }



// FUNCTIONS TO UPDATE CHART HERE

// CALL FUNCTIONS TO UPDATE ON CHANGE HERE

    // Update chart when radio button is selected - Parameter
    d3.selectAll(("input[name='Parameter']")).on('change', function(){
      updateChartParameter(this.value)
    })


    // Update chart when radio button is selected - Timeframe
    d3.selectAll(("input[name='Time']")).on('change', function(){
      updateChartYear(this.value)
    })

    // Update chart when radio button is selected - Group
    d3.selectAll(("input[name='Group']")).on('change', function(){
      updateChartGroup(this.value)
    })

    // Update chart when radio button is selected - D
    d3.selectAll(("input[name='Manip1']")).on('change', function(){
      updateChartManip1(this.value)
    })

    d3.selectAll(("input[name='Manip2']")).on('change', function(){
      updateChartManip2(this.value)
    })




// FUNCTION TO UPDATE METRIC BEING VIEWED: 
function updateChartParameter(Parameter) {

// Filter for the value on the other radio button(s)
    // Time filter
    var year_val = d3.select('input[name="Time"]:checked').property("value");
    var res1 = res.filter(d=>d.Time == parseInt(year_val))

    // Group filter
    var group_val = d3.select('input[name="Group"]:checked').property("value"); 
    var res2 = res1.filter(function (d) { return d.Group.match(group_val); })

    // Manip 1 filter
    var manip1_val = d3.select('input[name="Manip1"]:checked').property("value");
    var res3 = res2.filter(d=>d.Manip1 == manip1_val)

    // Manip 2 filter
    var manip2_val = d3.select('input[name="Manip2"]:checked').property("value");
    var res4 = res3.filter(d=>d.Manip2 == manip2_val)

    // Current Parameter Filter
    var resNew = res4.filter(d=>d.Parameter == Parameter)


// Define and update color scale
    var category = d3.map(resNew, function(d){return d.Location;}).keys()
    color2.domain(category).range(d3.schemePaired)

// Y-Axis Label Variables
    var parameter_label 
        if (Parameter == "CO2") { parameter_label =  "CO2"
        } else{ parameter_label =  "Energy"}

    var manip1_label 
        if (manip1_val == "Growth") { manip1_label =  ", Growth (%)"
        } else{ manip1_label =  ", (Twh)"}

    var manip2_label 
        if (manip2_val == "Population") { manip2_label =  " per Capita"
        } else if(manip2_val == "GDP") { manip2_label =  " per GDP"
        } else{manip2_label = ""}

    var y_axis_label = parameter_label + manip2_label + manip1_label
  
  // Define and Update Y axis
  yScale2.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

    svg.select('.y.axis')
        .transition().duration(750)
        .call(d3.axisLeft(yScale2).ticks(10, "s").tickSize(-width2))
        .call(g => {
                  g.selectAll("text")
                  .style("text-anchor", "middle")
                  .attr("x", -axisPad2*2)
                  .attr('fill', '#A9A9A9')

                  g.selectAll("line2")
                    .attr('stroke', '#A9A9A9')
                    .attr('stroke-width', 0.7)
                    .attr('opacity', 0.3)

                  g.select(".domain").remove()

                })

    // Define and Update X axis
    xScale2.domain(d3.extent(resNew, d=>d.date))

    svg2.select('.x.axis')
          .transition().duration(750)
          .call(d3.axisBottom(xScale2))
          .call(g => {
              var years = xScale2.ticks(d3.timeYear.every(1))
              var xshift = (width2/(years.length))/2 
              g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
                .style("text-anchor", "middle")
                .attr("y", axisPad2)
                .attr('fill', '#A9A9A9')

              g.selectAll("line2")
                .attr('stroke', '#A9A9A9')
    
              g.select(".domain")
                .attr('stroke', '#A9A9A9')

          })

    // Update Y-Axis Title
    svg2.selectAll('.y_label').remove()

    svg2.append("text")
          .attr("class", "y_label")
          .attr("text-anchor", "end")
          .attr("y", -45)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .attr("fill", "white")
          .text(y_axis_label);


  // Nest  Data:
      var res_nested = d3.nest()
        .key(d=>d.Location)
        .entries(resNew)

    // Update the other elements
      glines2.select('.line2') //select line path within line-group (which represents a category), then bind new data 
        .data(res_nested)
        .transition().duration(750)
        .attr('d', function(d) {
          return line2(d.values)
        })

      mouseG2.selectAll('.mouse-per-line')
        .data(res_nested)

      mouseG2.on('mousemove', function () { 
          var mouse = d3.mouse(this)
          updateTooltipContent(mouse, res_nested, color2)
        })
  }




// FUNCTION TO UPDATE CHART WITH  RADIO BUTTON THAT AFFECTS X-AXIS
function updateChartYear(Year) {

// Filter for the value on the other radio button(s)
    // Parameter filter
    var parameter_val = d3.select('input[name="Parameter"]:checked').property("value");
    var res1 = res.filter(d=>d.Parameter == parameter_val)

    // Group filter
    var group_val = d3.select('input[name="Group"]:checked').property("value"); 
    var res2 = res1.filter(function (d) { return d.Group.match(group_val); })

    // Manip 1 filter
    var manip1_val = d3.select('input[name="Manip1"]:checked').property("value");
    var res3 = res2.filter(d=>d.Manip1 == manip1_val)

    // Manip 2 filter
    var manip2_val = d3.select('input[name="Manip2"]:checked').property("value");
    var res4 = res3.filter(d=>d.Manip2 == manip2_val)

    // Current Time Filter
    var resNew = res4.filter(d=>d.Time == parseInt(Year))


// Define and update color scale
  var category = d3.map(resNew, function(d){return d.Location;}).keys()
  color2.domain(category).range(d3.schemePaired)

// Y-Axis Label Variables
  var parameter_label 
        if (parameter_val == "CO2") { parameter_label =  "CO2"
        } else{ parameter_label =  "Energy"}

    var manip1_label 
        if (manip1_val == "Growth") { manip1_label =  ", Growth (%)"
        } else{ manip1_label =  ", (Twh)"}

    var manip2_label 
        if (manip2_val == "Population") { manip2_label =  " per Capita"
        } else if(manip2_val == "GDP") { manip2_label =  " per GDP"
        } else{manip2_label = ""}

    var y_axis_label = parameter_label + manip2_label + manip1_label

// Define and Update Y axis
yScale2.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

svg2.select('.y.axis')
      .transition().duration(750)
      .call(d3.axisLeft(yScale2).ticks(10, "s").tickSize(-width))
      .call(g => {
                g.selectAll("text")
                .style("text-anchor", "middle")
                .attr("x", -axisPad2*2)
                .attr('fill', '#A9A9A9')

                g.selectAll("line2")
                  .attr('stroke', '#A9A9A9')
                  .attr('stroke-width', 0.7)
                  .attr('opacity', 0.3)

                g.select(".domain").remove()

              })


  // Define and Update X axis
  xScale2.domain(d3.extent(resNew, d=>d.date))

  svg2.select('.x.axis')
        .transition().duration(750)
        .call(d3.axisBottom(xScale2))
        .call(g => {
            var years = xScale2.ticks(d3.timeYear.every(1))
            var xshift = (width2/(years.length))/2 
            g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
              .style("text-anchor", "middle")
              .attr("y", axisPad2)
              .attr('fill', '#A9A9A9')

            g.selectAll("line2")
              .attr('stroke', '#A9A9A9')

            g.select(".domain")
              .attr('stroke', '#A9A9A9')

        })
  
  // Update Y-Axis Title
  svg2.selectAll('.y_label').remove()

  svg2.append("text")
          .attr("class", "y_label")
          .attr("text-anchor", "end")
          .attr("y", -45)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .attr("fill", "white")
          .text(y_axis_label);

 // Nest  Data:
    var res_nested = d3.nest()
      .key(d=>d.Location)
      .entries(resNew)

  // Update the other elements
    glines2.select('.line2')
      .data(res_nested)
      .transition().duration(750)
      .attr('d', function(d) {
        return line2(d.values)
      })

    mouseG2.selectAll('.mouse-per-line')
      .data(res_nested)

    mouseG2.on('mousemove', function () { 
        var mouse = d3.mouse(this)
        updateTooltipContent(mouse, res_nested, color2)
      })
  }




// FUNCTION TO UPDATE CHART BY GROUP OF COUNTRIES QUARTILE: 
// USE THIS TYPE OF FUNCTION IF THE NUMBER OF LINES WILL CHANGE BETWEEN FILTERS

  function updateChartGroup(Group) {

// Filter for the value on the other radio button(s)
    // Parameter filter
    var parameter_val = d3.select('input[name="Parameter"]:checked').property("value");
    var res1 = res.filter(d=>d.Parameter == parameter_val)

    // Year filter
    var year_val = d3.select('input[name="Time"]:checked').property("value");
    var res2 = res1.filter(d=>d.Time == parseInt(year_val))

    // Manip 1 filter
    var manip1_val = d3.select('input[name="Manip1"]:checked').property("value");
    var res3 = res2.filter(d=>d.Manip1 == manip1_val)

    // Manip 2 filter
    var manip2_val = d3.select('input[name="Manip2"]:checked').property("value");
    var res4 = res3.filter(d=>d.Manip2 == manip2_val)

    // Current Group Filter: checks whether the string contains the input:
    var resNew = res4.filter(function (d) { return d.Group.match(Group); })

// Y-Axis Label Variables
    var parameter_label 
        if (parameter_val == "CO2") { parameter_label =  "CO2"
        } else{ c =  "Energy"}

    var manip1_label
        if (manip1_val == "Growth") { manip1_label =  ", Growth (%)"
        } else{ manip1_label =  ", (Twh)"}

    var manip2_label
        if (manip2_val == "Population") { manip2_label =  " per Capita"
        } else if(manip2_val == "GDP") { manip2_label =  " per GDP"
        } else{manip2_label = ""}

    var y_axis_label = parameter_label + manip2_label + manip1_label

// Define and update color scale
    var category = d3.map(resNew, function(d){return d.Location;}).keys()
    color2.domain(category).range(d3.schemePaired)

// Define and update legend
    svgLegend2.selectAll('.legend2').remove();

    var legend2 = svgLegend2.selectAll('.legend2')
          .data(category)
          .enter().append('g')
            .attr("class", "legend2")
            .attr("transform", function (d, i) {return "translate(0," + i * 20 + ")"})

    legend2.append("circle")
          .attr("class", "legend-node")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", R2)
          .style("fill", d=>color2(d))

    legend2.append("text")
          .attr("class", "legend-text")
          .attr("x", R2*2)
          .attr("y", R2/2)
          .style("fill", "#A9A9A9")
          .style("font-size", 12)
          .text(d=>d)

  // Define and Update Y axis
  yScale2.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

  svg2.select('.y.axis')
                .transition().duration(750)
        .call(d3.axisLeft(yScale2).ticks(10, "s").tickSize(-width2))
        .call(g => {
              g.selectAll("text")
              .style("text-anchor", "middle")
              .attr("x", -axisPad2*2)
              .attr('fill', '#A9A9A9')

              g.selectAll("line2")
                .attr('stroke', '#A9A9A9')
                .attr('stroke-width', 0.7) 
                .attr('opacity', 0.3)

              g.select(".domain").remove()

            })

  // Update Y-Axis Title
  svg2.selectAll('.y_label').remove()

  svg2.append("text")
        .attr("class", "y_label")
        .attr("text-anchor", "end")
        .attr("y", -45)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr("fill", "white")
        .text(y_axis_label);

    // Nest Data:
        var res_nested = d3.nest()
          .key(d=>d.Location)
          .entries(resNew)

    // Update the lines: Need to start from scratch here. 
    svg2.selectAll('.lines2').remove()

        var lines2 = svg2.append('g')
            .attr('class', 'lines2')

        glines2 = lines2.selectAll('.line-group')
            .data(res_nested).enter()
            .append('g')
            .attr('class', 'line-group')

          glines2  
            .append('path')
              .attr('class', 'line2')  
              .attr('d', d => line2(d.values))
              .style('stroke', d => {
            return color2(d.key)
          })
              .style('fill', 'none')
              .style('opacity', lineOpacity2)
              .style('stroke-width', lineStroke2)
    

    // Update the mouselines: will also need to start from scratch here. 
    // mouseG2.selectAll('.mouse-per-line').data(res_nested)
    svg2.selectAll('.mouse-per-line').remove()

    mouseG2 = svg2.append("g")
      .attr("class", "mouse-over-effects");

    mouseG2.append("path") // create vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#A9A9A9")
      .style("stroke-width", lineStroke2)
      // .style("opacity", "0");
      .style("opacity", "1");


    var lines2 = document.getElementsByClassName('line2');

    var mousePerLine = mouseG2.selectAll('.mouse-per-line')
      .data(res_nested)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", function (d) {
        return color2(d.key)
      })
      .style("fill", "none")
      .style("stroke-width", lineStroke2)
      .style("opacity", "0");

    mouseG2.append('svg2:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width2) 
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () { // on mouse out hide line, circles and text
        // d3.select(".mouse-line")
        //   .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll("#tooltip2")
          .style('display', 'block')
      })
      .on('mousemove', function () { // update tooltip2 content, line, circles and text when mouse moves
        var mouse = d3.mouse(this)

        d3.selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {
            var xDate = xScale2.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
            var bisect = d3.bisector(function (d) { return d.date; }).left // retrieve row index of date on parsed csv
            var idx = bisect(d.values, xDate);

            d3.select(".mouse-line")
              .attr("d", function () {
                var data = "M" + xScale2(d.values[idx].date) + "," + (height2);
                data += " " + xScale2(d.values[idx].date) + "," + 0;
                return data;
              });
            return "translate(" + xScale2(d.values[idx].date) + "," + yScale2(d.values[idx].Value) + ")";

          });

        updatetooltipContent(mouse, res_nested, color2)

      })





    // Update the tooltip. 
    mouseG2.on('mousemove', function () { 
        var mouse = d3.mouse(this)
        updateTooltipContent(mouse, res_nested, color2)
      })
  }




// FUNCTION TO UPDATE MANIP 1: 
function updateChartManip1(Manip1) {

// Filter for the value on the other radio button(s)
    // Time filter
    var year_val = d3.select('input[name="Time"]:checked').property("value");
    var res1 = res.filter(d=>d.Time == parseInt(year_val))

    // Group filter
    var group_val = d3.select('input[name="Group"]:checked').property("value"); 
    var res2 = res1.filter(function (d) { return d.Group.match(group_val); })

    // Parameter filter
    var parameter_val = d3.select('input[name="Parameter"]:checked').property("value");
    var res3 = res2.filter(d=>d.Parameter == parameter_val)

    // Manip 2 filter
    var manip2_val = d3.select('input[name="Manip2"]:checked').property("value");
    var res4 = res3.filter(d=>d.Manip2 == manip2_val)

    // Current Parameter Filter
    var resNew = res4.filter(d=>d.Manip1 == Manip1)

    // Y-Axis Label Variables
    var parameter_label 
        if (parameter_val == "CO2") { parameter_label =  "CO2"
        } else{ parameter_label =  "Energy"}

    var manip1_label
        if (Manip1 == "Growth") { manip1_label =  ", Growth (%)"
        } else{ manip1_label =  ", (Twh)"}

    var manip2_label
        if (manip2_val == "Population") { manip2_label =  " per Capita"
        } else if(manip2_val == "GDP") { manip2_label =  " per GDP"
        } else{manip2_label = ""}

    var y_axis_label = parameter_label + manip2_label + manip1_label


  // Define and update color scale
    var category = d3.map(resNew, function(d){return d.Location;}).keys()
    color2.domain(category).range(d3.schemePaired)

  
  // Define and Update Y axis
  yScale2.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

  svg2.select('.y.axis')
        .transition().duration(750)
        .call(d3.axisLeft(yScale2).ticks(10, "s").tickSize(-width2))
        .call(g => {
                  g.selectAll("text")
                  .style("text-anchor", "middle")
                  .attr("x", -axisPad2*2)
                  .attr('fill', '#A9A9A9')

                  g.selectAll("line2")
                    .attr('stroke', '#A9A9A9')
                    .attr('stroke-width', 0.7)
                    .attr('opacity', 0.3)

                  g.select(".domain").remove()

                })
   

  // Define and Update X axis
  xScale2.domain(d3.extent(resNew, d=>d.date))

  svg2.select('.x.axis')
        .transition().duration(750)
        .call(d3.axisBottom(xScale2))
        .call(g => {
            var years = xScale2.ticks(d3.timeYear.every(1))
            var xshift = (width2/(years.length))/2 
            g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
              .style("text-anchor", "middle")
              .attr("y", axisPad2)
              .attr('fill', '#A9A9A9')

            g.selectAll("line2")
              .attr('stroke', '#A9A9A9')
  
            g.select(".domain")
              .attr('stroke', '#A9A9A9')

        })

  // Update Y-Axis Title
  svg2.selectAll('.y_label').remove()

  svg2.append("text")
      .attr("class", "y_label")
      .attr("text-anchor", "end")
      .attr("y", -45)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .attr("fill", "white")
      .text(y_axis_label);

  // Nest  Data:
      var res_nested = d3.nest()
        .key(d=>d.Location)
        .entries(resNew)

    // Update the other elements
      glines2.select('.line2') //select line path within line-group (which represents a category), then bind new data 
        .data(res_nested)
        .transition().duration(750)
        .attr('d', function(d) {
          return line2(d.values)
        })

      mouseG2.selectAll('.mouse-per-line')
        .data(res_nested)

      mouseG2.on('mousemove', function () { 
          var mouse = d3.mouse(this)
          updateTooltipContent(mouse, res_nested, color2)
        })
  }



// FUNCTION TO UPDATE MANIP 2: 
function updateChartManip2(Manip2) {

// Filter for the value on the other radio button(s)
    // Time filter
    var year_val = d3.select('input[name="Time"]:checked').property("value");
    var res1 = res.filter(d=>d.Time == parseInt(year_val))

    // Group filter
    var group_val = d3.select('input[name="Group"]:checked').property("value"); 
    var res2 = res1.filter(function (d) { return d.Group.match(group_val); })

    // Parameter filter
    var parameter_val = d3.select('input[name="Parameter"]:checked').property("value");
    var res3 = res2.filter(d=>d.Parameter == parameter_val)

    // Manip 2 filter
    var manip1_val = d3.select('input[name="Manip1"]:checked').property("value");
    var res4 = res3.filter(d=>d.Manip1 == manip1_val)

    // Current Parameter Filter
    var resNew = res4.filter(d=>d.Manip2 == Manip2)

// Y-Axis Label Variables
  var parameter_label 
        if (parameter_val == "CO2") { parameter_label =  "CO2"
        } else{ parameter_label =  "Energy"}

    var manip1_label 
        if (manip1_val == "Growth") { manip1_label =  ", Growth (%)"
        } else{ manip1_label =  ", (Twh)"}

    var manip2_label 
        if (Manip2 == "Population") { manip2_label =  " per Capita"
        } else if(Manip2 == "GDP") { manip2_label =  " per GDP"
        } else{manip2_label = ""}

    var y_axis_label = parameter_label + manip2_label + manip1_label

  // Define and update color scale
    var category = d3.map(resNew, function(d){return d.Location;}).keys()
    color2.domain(category).range(d3.schemePaired)

  
  // Define and Update Y axis
  yScale2.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

  svg2.select('.y.axis')
        .transition().duration(750)
        .call(d3.axisLeft(yScale2).ticks(10, "s").tickSize(-width2))
        .call(g => {
                  g.selectAll("text")
                  .style("text-anchor", "middle")
                  .attr("x", -axisPad2*2)
                  .attr('fill', '#A9A9A9')

                  g.selectAll("line")
                    .attr('stroke', '#A9A9A9')
                    .attr('stroke-width', 0.7)
                    .attr('opacity', 0.3)

                  g.select(".domain").remove()

                })

      

  // Define and Update X axis
  xScale2.domain(d3.extent(resNew, d=>d.date))

  svg2.select('.x.axis')
        .transition().duration(750)
        .call(d3.axisBottom(xScale2))
        .call(g => {
            var years = xScale2.ticks(d3.timeYear.every(1))
            var xshift = (width2/(years.length))/2 
            g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
              .style("text-anchor", "middle")
              .attr("y", axisPad2)
              .attr('fill', '#A9A9A9')

            g.selectAll("line2")
              .attr('stroke', '#A9A9A9')
  
            g.select(".domain")
              .attr('stroke', '#A9A9A9')

        })

  // Update Y-Axis Title
  svg2.selectAll('.y_label').remove()

  svg2.append("text")
        .attr("class", "y_label")
        .attr("text-anchor", "end")
        .attr("y", -45)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr("fill", "white")
        .text(y_axis_label);

  // Nest  Data:
      var res_nested = d3.nest()
        .key(d=>d.Location)
        .entries(resNew)

    // Update the other elements
      glines2.select('.line2') //select line path within line-group (which represents a category), then bind new data 
        .data(res_nested)
        .transition().duration(750)
        .attr('d', function(d) {
          return line2(d.values)
        })

      mouseG2.selectAll('.mouse-per-line')
        .data(res_nested)

      mouseG2.on('mousemove', function () { 
          var mouse = d3.mouse(this)
          updateTooltipContent(mouse, res_nested, color2)
        })
  }








// FUNCTION FOR UPDATING TOOL TIP CONTENT:
function updateTooltipContent(mouse, res_nested, color2) {

  var f = d3.format(".1f");

  sortingObj = []
  res_nested.map(d => {
    var xDate = xScale2.invert(mouse[0])
    var bisect = d3.bisector(function (d) { return d.date; }).left
    var idx = bisect(d.values, xDate)
    sortingObj.push({key: d.values[idx].Location, Value: d.values[idx].Value, Group: d.values[idx].Group, year: d.values[idx].date.getFullYear(), month: d.values[idx].date.getMonth()})
  })


  sortingObj.sort(function(x, y){
     return d3.descending(x.Value, y.Value);
  })

  var sortingArr = sortingObj.map(d=> d.key)

  var res_nested1 = res_nested.slice().sort(function(a, b){
    return sortingArr.indexOf(a.key) - sortingArr.indexOf(b.key) // rank country based on metric
  })

  tooltip2.html("Year: "+ sortingObj[0].year)
    .style('display', 'block')
    .attr('id', 'tooltip2_title')
    .selectAll()
    .data(res_nested1).enter()
    .append('div')
    .style('color', d => {
      return color2(d.key)
    })
    .attr('id', 'tooltip2_text')
    .html(d => {
      var xDate = xScale2.invert(mouse[0])
      var bisect = d3.bisector(function (d) { return d.date; }).left
      var idx = bisect(d.values, xDate)
      return d.key + ": " + f(d.values[idx].Value).toString() + " TWh"

    })
}
})

// END OF D3 CSV CHART FUNCTION

