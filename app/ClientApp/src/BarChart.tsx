import React, { Component } from "react";
// @ts-ignore
import * as d3 from "d3";
import data from "./corona-data-fi.json";

class BarChart extends Component {
  componentDidMount() {
    const numberData = data.data.timeline
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .map((day) => day.confirmed);
    this.drawBarChart(numberData);
  }
  drawBarChart(data: number[]) {
    const canvasHeight = 400;
    const canvasWidth = 1200;
    const scale = 0.03;

    const svgCanvas = d3
      .select("div")
      .append("svg")
      .attr("width", canvasWidth)
      .attr("height", canvasHeight)
      .style("border", "1px solid black");

    svgCanvas
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", 2)
      .attr("height", (datapoint: any) => datapoint * scale)
      .attr("fill", "orange")
      .attr("x", (datapoint: any, iteration: any) => iteration * 5)
      .attr(
        "y",
        (dataPoint: any, i: any) => canvasHeight - dataPoint * scale - 10
      );

    var tooltip = d3
      .select("#testing")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    d3.selectAll("rect")
      .on("mouseover", function (event: any) {
        return tooltip
          .style("visibility", "visible")
          .text(event.srcElement.__data__);
      })
      .on("mousemove", function (event: MouseEvent) {
        return tooltip
          .style("top", event.pageY + "px")
          .style("left", event.pageX + "px");
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });
  }
  render() {
    return <div></div>;
  }
}
export default BarChart;
