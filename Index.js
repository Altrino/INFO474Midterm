"use strict";
(function(){

    const colors = {
        "Bug": "#4E79A7",
        "Dark": "#A0CBE8",
        "Electric": "#F28E2B",
        "Fairy": "#FFBE7D",
        "Fighting": "#59A14F",
        "Fire": "#8CD17D",
        "Ghost": "#B6992D",
        "Grass": "#499894",
        "Ground": "#86BCB6",
        "Ice": "#FABFD2",
        "Normal": "#E15759",
        "Poison": "#FF9D9A",
        "Psychic": "#79706E",
        "Steel": "#BAB0AC",
        "Water": "#D37295"
    }

    let data = ""
    let svgContainer = ""
    let legendary = ""
    let generation = ""

    
    const measurements = {
        width: 800,
        height: 500,
        marginAll: 50
    }

    svgContainer = d3.select('body').append("svg")
        .attr('width', measurements.width)
        .attr('height', measurements.height)

    let tooltip = d3.select("body")
        .append("div")
        .style("background-color", "white")
        .style("border-radius", "5px")
        .style("opacity", 0.8)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("display", "flex")

    d3.csv("pokemon.csv")
        .then((csvData) => data = csvData)
        .then(() => makeScatterPlot())

    function makeScatterPlot() {
        data = data.filter(function(row) {
            return row['Legendary'].includes(legendary)
        })
        data = data.filter(function(row) {
            return row['Generation'].includes(generation)
        })
        
        let x = data.map((row) => parseInt(row["Sp. Def"]))
        let y = data.map((row) =>  parseInt(row["Total"]))
        
        const limits = findMinMax(x, y)
        
        let scaleX = d3.scaleLinear()
            .domain([limits.xMin - 5, limits.xMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])
        
        let scaleY = d3.scaleLinear()
            .domain([limits.yMax, limits.yMin - 0.05])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])
        
        drawAxes(scaleX, scaleY)

        plotData(scaleX, scaleY)
    }

    function findMinMax(x, y) {
        return {
            xMin: d3.min(x),
            xMax: d3.max(x),
            yMin: d3.min(y),
            yMax: d3.max(y)
        }
    }

    function drawAxes(scaleX, scaleY) {
        
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)
        
        svgContainer.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)
    }

    function plotData(scaleX, scaleY) {
        
        const xMap = function(d) { return scaleX(+d["Sp. Def"]) }
        const yMap = function(d) { return scaleY(+d["Total"]) } 
        
        const circles = svgContainer.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', xMap)
                .attr('cy', yMap)
                .attr('r', 5)
                .attr('fill', function(d) {
                    return colors[d["Type 1"]]
                })
                .on("mouseover", function(d) {
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", "5px")
                        .style("opacity", 1)
                    tooltip.style("visibility", "visible")
                        .html(d.Name + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
                })
                .on("mousemove", function() {
                    tooltip.style("top", (event.pageY - 10) + "px")
                        .style("left",(event.pageX + 10) + "px")
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .style("stroke", "none")  
                    tooltip.style("visibility", "hidden")
                })
    }

    svgContainer.append("text")
            .attr("text-anchor", "middle")  
            .attr("transform", "translate("+ 10 + "," + 250 + ")rotate(-90)") 
            .text("Total")

    svgContainer.append("text")
            .attr("text-anchor", "middle") 
            .attr("transform", "translate(" + 400 + "," + 490 + ")")
            .text("Sp. Def")

    function reDraw() {
        d3.selectAll("g").remove()
        d3.selectAll("circle").remove()
        d3.csv("pokemon.csv")
        .then((csvData) => data = csvData)
        .then(() => makeScatterPlot())
    }

    d3.select('#all').on("click", function() {
        legendary = ""
        reDraw()
    })
    d3.select('#true').on("click", function() {
        legendary = "True"
        reDraw()
    })
    d3.select('#false').on("click", function() {
        legendary = "False"
        reDraw()
    })
    
    d3.select('#gen').on("change", function() {
        var sel = document.getElementById('gen')
        generation = sel.options[sel.selectedIndex].value
        reDraw()
    })
    
    var SVG = d3.select('body').append("svg")
        .attr('width', 110)
        .attr('height', 420)
        .attr("color", "black")
    
    var keys = Object.keys(colors)
    
    var size = 20
    SVG.selectAll("mydots")
    .data(keys)
    .enter()
    .append("rect")
        .attr("x", 20)
        .attr("y", function(d,i){ return 20 + i * (size + 5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return colors[d]})
    
    SVG.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", 20 + size * 1.2)
        .attr("y", function(d,i){ return 20 + i * (size + 5) + (size / 2)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
})()    