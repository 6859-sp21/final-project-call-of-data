// SOURCE: Adapted from Dianaow’s Block 0da76b59a7dffe24abcfa55d5b9e163e
// https://bl.ocks.org/dianaow/0da76b59a7dffe24abcfa55d5b9e163e 

// SET GLOBAL VARIABLES FOR THE CHART
var glines
var mouseG
var tooltip

var parseDate = d3.timeParse("%Y-%m-%d")

var margin = {top: 50, right: 100, bottom: 50, left: 200}
var width = 900 - margin.left - margin.right
var height = 450 - margin.top - margin.bottom

var lineOpacity = 1
var lineStroke = "2px"

var axisPad = 6 // axis formatting
var XAxisHeight = 40
var R = 6 //legend marker

// Declare Tooltip first
var tooltip = d3.select("#viz")
            .append("div")
            .attr('id', 'tooltip')
            .style('position', 'absolute')
            .style("background-color", "#D3D3D3")
            .style('display', 'block')

// SVG should be a global variable if we want axes to update
// Source for responsive axes: https://www.d3-graph-gallery.com/graph/scatter_buttonXlim.html
var svg = d3.select("#viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// In general, any element we want to update should be globally set

var yScale = d3.scaleLinear()
var xScale = d3.scaleTime()
var color = d3.scaleOrdinal()

var yAxis
var xAxis

var svgLegend = svg.append('g')
      .attr('class', 'gLegend')
      .attr("transform", "translate(" + (width + 20) + "," + 0 + ")")

var legend


// START OF D3 CSV CHART FUNCTION
d3.csv("data/output/reshaped_country_data.csv", data => {

  var res = data.map((d,i) => {
    return {
      date : parseDate(d.Year),
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

  xScale.domain(d3.extent(res, d=>d.date))
    .range([0, width])

  yScale.domain([d3.min(res, d => d.Value), d3.max(res, d => d.Value)])
    .range([height, 0]);

 var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.Value))


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
    color.domain(category).range(d3.schemePaired)


    // CREATE LEGEND // 
      legend = svgLegend.selectAll('.legend')
          .data(category)
          .enter().append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) {return "translate(0," + i * 20 + ")"})

      legend.append("circle")
          .attr("class", "legend-node")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", R)
          .style("fill", d=>color(d))

      legend.append("text")
          .attr("class", "legend-text")
          .attr("x", R*2)
          .attr("y", R/2)
          .style("fill", "#A9A9A9")
          .style("font-size", 12)
          .text(d=>d)


    // APPEND MULTIPLE LINES //
    var lines = svg.append('g')
      .attr('class', 'lines')

    glines = lines.selectAll('.line-group')
      .data(res_nested).enter()
      .append('g')
      .attr('class', 'line-group')

    glines  
      .append('path')
        .attr('class', 'line')  
        .attr('d', d => line(d.values))
        .style('stroke', d => {
      return color(d.key)
    })
        .style('fill', 'none')
        .style('opacity', lineOpacity)
        .style('stroke-width', lineStroke)
    

    // APPEND Y AXIS //
    yScale.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

    yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(10, "s").tickSize(-width))
        .call(g => {
              g.selectAll("text")
              .style("text-anchor", "middle")
              .attr("x", -axisPad*2)
              .attr('fill', '#A9A9A9')

              g.selectAll("line")
                .attr('stroke', '#A9A9A9')
                .attr('stroke-width', 0.7) // make horizontal tick thinner and lighter so that line paths can stand out
                .attr('opacity', 0.3)

              g.select(".domain").remove()

            })

      
    // APPEND X AXIS //
    xScale.domain(d3.extent(resNew, d=>d.date))

    xAxis = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .call(g => {
          var years = xScale.ticks(d3.timeYear.every(1))
          var xshift = (width/(years.length))/2 
          g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
            .style("text-anchor", "middle")
            .attr("y", axisPad)
            .attr('fill', '#A9A9A9')

          g.selectAll("line")
            .attr('stroke', '#A9A9A9')

          g.select(".domain")
            .attr('stroke', '#A9A9A9')

      }) 


// APPEND AXIS TITLES //
    // X AXIS
    svg.append("text")
      .attr("class", "x_label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 35)
      .attr("fill", "white")
      .attr("weight", "white")
      .text("Years");
      
    
      // Y AXIS
    svg.append("text")
      .attr("class", "y_label")
      .attr("text-anchor", "end")
      .attr("y", -45)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .attr("fill", "white")
      .text(y_axis_label);



// CREATE HOVER TOOLTIP WITH VERTICAL LINE //
    mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // create vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#A9A9A9")
      .style("stroke-width", lineStroke)
      // .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(res_nested)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", function (d) {
        return color(d.key)
      })
      .style("fill", "none")
      .style("stroke-width", lineStroke)
      .style("opacity", "0");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) 
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
        // d3.selectAll("#tooltip")
        //   .style('display', 'none')

      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        // d3.selectAll("#tooltip")
        //   .style('display', 'block')
      })
      .on('mousemove', function () { // update tooltip content, line, circles and text when mouse moves
        var mouse = d3.mouse(this)

        d3.selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {
            var xDate = xScale.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
            var bisect = d3.bisector(function (d) { return d.date; }).left // retrieve row index of date on parsed csv
            var idx = bisect(d.values, xDate);

            d3.select(".mouse-line")
              .attr("d", function () {
                var data = "M" + xScale(d.values[idx].date) + "," + (height);
                data += " " + xScale(d.values[idx].date) + "," + 0;
                return data;
              });
            return "translate(" + xScale(d.values[idx].date) + "," + yScale(d.values[idx].Value) + ")";

          });

        updateTooltipContent(mouse, res_nested, color)

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
    color.domain(category).range(d3.schemePaired)

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
    yScale.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

    svg.select('.y.axis')
        .transition().duration(750)
        .call(d3.axisLeft(yScale).ticks(10, "s").tickSize(-width))
        .call(g => {
                  g.selectAll("text")
                  .style("text-anchor", "middle")
                  .attr("x", -axisPad*2)
                  .attr('fill', '#A9A9A9')

                  g.selectAll("line")
                    .attr('stroke', '#A9A9A9')
                    .attr('stroke-width', 0.7)
                    .attr('opacity', 0.3)

                  g.select(".domain").remove()

                })

    // Define and Update X axis
      xScale.domain(d3.extent(resNew, d=>d.date))

      svg.select('.x.axis')
          .transition().duration(750)
          .call(d3.axisBottom(xScale))
          .call(g => {
              var years = xScale.ticks(d3.timeYear.every(1))
              var xshift = (width/(years.length))/2 
              g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
                .style("text-anchor", "middle")
                .attr("y", axisPad)
                .attr('fill', '#A9A9A9')

              g.selectAll("line")
                .attr('stroke', '#A9A9A9')
    
              g.select(".domain")
                .attr('stroke', '#A9A9A9')

          })

    // Update Y-Axis Title
      svg.selectAll('.y_label').remove()

        svg.append("text")
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
      glines.select('.line') //select line path within line-group (which represents a category), then bind new data 
        .data(res_nested)
        .transition().duration(750)
        .attr('d', function(d) {
          return line(d.values)
        })

      mouseG.selectAll('.mouse-per-line')
        .data(res_nested)

      mouseG.on('mousemove', function () { 
          var mouse = d3.mouse(this)
          updateTooltipContent(mouse, res_nested, color)
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
  color.domain(category).range(d3.schemePaired)

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
  yScale.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

  svg.select('.y.axis')
      .transition().duration(750)
      .call(d3.axisLeft(yScale).ticks(10, "s").tickSize(-width))
      .call(g => {
                g.selectAll("text")
                .style("text-anchor", "middle")
                .attr("x", -axisPad*2)
                .attr('fill', '#A9A9A9')

                g.selectAll("line")
                  .attr('stroke', '#A9A9A9')
                  .attr('stroke-width', 0.7)
                  .attr('opacity', 0.3)

                g.select(".domain").remove()

              })


  // Define and Update X axis
    xScale.domain(d3.extent(resNew, d=>d.date))

    svg.select('.x.axis')
        .transition().duration(750)
        .call(d3.axisBottom(xScale))
        .call(g => {
            var years = xScale.ticks(d3.timeYear.every(1))
            var xshift = (width/(years.length))/2 
            g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
              .style("text-anchor", "middle")
              .attr("y", axisPad)
              .attr('fill', '#A9A9A9')

            g.selectAll("line")
              .attr('stroke', '#A9A9A9')

            g.select(".domain")
              .attr('stroke', '#A9A9A9')

        })
  
  // Update Y-Axis Title
      svg.selectAll('.y_label').remove()

        svg.append("text")
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
    glines.select('.line')
      .data(res_nested)
      .transition().duration(750)
      .attr('d', function(d) {
        return line(d.values)
      })

    mouseG.selectAll('.mouse-per-line')
      .data(res_nested)

    mouseG.on('mousemove', function () { 
        var mouse = d3.mouse(this)
        updateTooltipContent(mouse, res_nested, color)
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
    color.domain(category).range(d3.schemePaired)

// Define and update legend
    svgLegend.selectAll('.legend').remove();

    var legend = svgLegend.selectAll('.legend')
          .data(category)
          .enter().append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) {return "translate(0," + i * 20 + ")"})

      legend.append("circle")
          .attr("class", "legend-node")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", R)
          .style("fill", d=>color(d))

      legend.append("text")
          .attr("class", "legend-text")
          .attr("x", R*2)
          .attr("y", R/2)
          .style("fill", "#A9A9A9")
          .style("font-size", 12)
          .text(d=>d)

  // Define and Update Y axis
    yScale.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

    svg.select('.y.axis')
                .transition().duration(750)
        .call(d3.axisLeft(yScale).ticks(10, "s").tickSize(-width))
        .call(g => {
              g.selectAll("text")
              .style("text-anchor", "middle")
              .attr("x", -axisPad*2)
              .attr('fill', '#A9A9A9')

              g.selectAll("line")
                .attr('stroke', '#A9A9A9')
                .attr('stroke-width', 0.7) 
                .attr('opacity', 0.3)

              g.select(".domain").remove()

            })

  // Update Y-Axis Title
      svg.selectAll('.y_label').remove()

      svg.append("text")
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
        svg.selectAll('.lines').remove()

        var lines = svg.append('g')
            .attr('class', 'lines')

        glines = lines.selectAll('.line-group')
            .data(res_nested).enter()
            .append('g')
            .attr('class', 'line-group')

          glines  
            .append('path')
              .attr('class', 'line')  
              .attr('d', d => line(d.values))
              .style('stroke', d => {
            return color(d.key)
          })
              .style('fill', 'none')
              .style('opacity', lineOpacity)
              .style('stroke-width', lineStroke)
    

    // Update the mouselines: will also need to start from scratch here. 
    // mouseG.selectAll('.mouse-per-line').data(res_nested)
    svg.selectAll('.mouse-per-line').remove()

    mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // create vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#A9A9A9")
      .style("stroke-width", lineStroke)
      // .style("opacity", "0");
      .style("opacity", "1");


    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(res_nested)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", function (d) {
        return color(d.key)
      })
      .style("fill", "none")
      .style("stroke-width", lineStroke)
      .style("opacity", "0");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) 
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
        d3.selectAll("#tooltip")
          .style('display', 'block')
      })
      .on('mousemove', function () { // update tooltip content, line, circles and text when mouse moves
        var mouse = d3.mouse(this)

        d3.selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {
            var xDate = xScale.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
            var bisect = d3.bisector(function (d) { return d.date; }).left // retrieve row index of date on parsed csv
            var idx = bisect(d.values, xDate);

            d3.select(".mouse-line")
              .attr("d", function () {
                var data = "M" + xScale(d.values[idx].date) + "," + (height);
                data += " " + xScale(d.values[idx].date) + "," + 0;
                return data;
              });
            return "translate(" + xScale(d.values[idx].date) + "," + yScale(d.values[idx].Value) + ")";

          });

        updateTooltipContent(mouse, res_nested, color)

      })





    // Update the tooltip. 
    mouseG.on('mousemove', function () { 
        var mouse = d3.mouse(this)
        updateTooltipContent(mouse, res_nested, color)
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
    color.domain(category).range(d3.schemePaired)

  
  // Define and Update Y axis
    yScale.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

    svg.select('.y.axis')
        .transition().duration(750)
        .call(d3.axisLeft(yScale).ticks(10, "s").tickSize(-width))
        .call(g => {
                  g.selectAll("text")
                  .style("text-anchor", "middle")
                  .attr("x", -axisPad*2)
                  .attr('fill', '#A9A9A9')

                  g.selectAll("line")
                    .attr('stroke', '#A9A9A9')
                    .attr('stroke-width', 0.7)
                    .attr('opacity', 0.3)

                  g.select(".domain").remove()

                })
   

  // Define and Update X axis
    xScale.domain(d3.extent(resNew, d=>d.date))

    svg.select('.x.axis')
        .transition().duration(750)
        .call(d3.axisBottom(xScale))
        .call(g => {
            var years = xScale.ticks(d3.timeYear.every(1))
            var xshift = (width/(years.length))/2 
            g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
              .style("text-anchor", "middle")
              .attr("y", axisPad)
              .attr('fill', '#A9A9A9')

            g.selectAll("line")
              .attr('stroke', '#A9A9A9')
  
            g.select(".domain")
              .attr('stroke', '#A9A9A9')

        })

  // Update Y-Axis Title
    svg.selectAll('.y_label').remove()

    svg.append("text")
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
      glines.select('.line') //select line path within line-group (which represents a category), then bind new data 
        .data(res_nested)
        .transition().duration(750)
        .attr('d', function(d) {
          return line(d.values)
        })

      mouseG.selectAll('.mouse-per-line')
        .data(res_nested)

      mouseG.on('mousemove', function () { 
          var mouse = d3.mouse(this)
          updateTooltipContent(mouse, res_nested, color)
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
    color.domain(category).range(d3.schemePaired)

  
  // Define and Update Y axis
    yScale.domain([d3.min(resNew, d => d.Value), d3.max(resNew, d => d.Value)])

    svg.select('.y.axis')
        .transition().duration(750)
        .call(d3.axisLeft(yScale).ticks(10, "s").tickSize(-width))
        .call(g => {
                  g.selectAll("text")
                  .style("text-anchor", "middle")
                  .attr("x", -axisPad*2)
                  .attr('fill', '#A9A9A9')

                  g.selectAll("line")
                    .attr('stroke', '#A9A9A9')
                    .attr('stroke-width', 0.7)
                    .attr('opacity', 0.3)

                  g.select(".domain").remove()

                })

      

  // Define and Update X axis
    xScale.domain(d3.extent(resNew, d=>d.date))

    svg.select('.x.axis')
        .transition().duration(750)
        .call(d3.axisBottom(xScale))
        .call(g => {
            var years = xScale.ticks(d3.timeYear.every(1))
            var xshift = (width/(years.length))/2 
            g.selectAll("text").attr("transform", `translate(${xshift}, 0)`) //shift tick labels to middle of interval
              .style("text-anchor", "middle")
              .attr("y", axisPad)
              .attr('fill', '#A9A9A9')

            g.selectAll("line")
              .attr('stroke', '#A9A9A9')
  
            g.select(".domain")
              .attr('stroke', '#A9A9A9')

        })

  // Update Y-Axis Title
      svg.selectAll('.y_label').remove()

      svg.append("text")
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
      glines.select('.line') //select line path within line-group (which represents a category), then bind new data 
        .data(res_nested)
        .transition().duration(750)
        .attr('d', function(d) {
          return line(d.values)
        })

      mouseG.selectAll('.mouse-per-line')
        .data(res_nested)

      mouseG.on('mousemove', function () { 
          var mouse = d3.mouse(this)
          updateTooltipContent(mouse, res_nested, color)
        })
  }








// FUNCTION FOR UPDATING TOOL TIP CONTENT:
function updateTooltipContent(mouse, res_nested, color) {

  var f = d3.format(".1f");

  sortingObj = []
  res_nested.map(d => {
    var xDate = xScale.invert(mouse[0])
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

  tooltip.html("Year: "+ sortingObj[0].year)
    .style('display', 'block')
    .attr('id', 'tooltip_title')
    .selectAll()
    .data(res_nested1).enter()
    .append('div')
    .style('color', d => {
      return color(d.key)
    })
    .attr('id', 'tooltip_text')
    .html(d => {
      var xDate = xScale.invert(mouse[0])
      var bisect = d3.bisector(function (d) { return d.date; }).left
      var idx = bisect(d.values, xDate)
      return d.key + ": " + f(d.values[idx].Value).toString() + " TWh"

    })
}
})

// END OF D3 CSV CHART FUNCTION




// RENDER THE CHART ON SUBMISSION OF FORM ONE: 
document.getElementById("form1").onsubmit=function() {

  param = document.querySelector('#form1 input[name = "Parameter"]:checked').value;
  time = document.querySelector('#form1 input[name = "Time"]:checked').value;
  group = document.querySelector('#form1 input[name = "Group"]:checked').value;
  manip1 = document.querySelector('#form1 input[name = "Manip1"]:checked').value;
  manip2 = document.querySelector('#form1 input[name="Manip2"]:checked').value;


  renderChart(param, time, group, manip1, manip2);
  updateChartParameter(param);
  updateChartYear(time);
  updateChartGroup(group);
  updateChartManip1(manip1);
  updateChartManip2(manip2);

}