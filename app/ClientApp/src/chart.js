import * as d3 from "d3";

const parseTime = d3.timeParse("%Y-%m-%d");
const bisectDate = d3.bisector(function (d) {
  return d.date;
}).left;
const dateFormatter = d3.timeFormat("%Y-%m-%d");

let chart = {},
  x,
  y,
  line,
  width,
  height,
  g;

chart.create = (el, props, state) => {
  const margin = { top: 20, right: 150, bottom: 30, left: 50 };

  let svg = d3
    .select(el)
    .append("svg")
    .attr("class", "chart")
    .attr("width", props.width)
    .attr("height", props.height);

  width = svg.attr("width") - margin.left - margin.right;
  height = svg.attr("height") - margin.top - margin.bottom;
  g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  x = d3.scaleTime().rangeRound([0, width]);
  y = d3.scaleLinear().rangeRound([height, 0]);

  line = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.data);
    });

  chart.update(state);
};

chart.update = (state) => {
  let svg = d3.select("svg");

  state.data.forEach((chartLine) => {
    chart.parseData(chartLine.lineData);
  });

  chart.drawAxis(svg, state.data[0].lineData, state.chartTitle);
  state.data.forEach((chartLine) => {
    chart.drawLine(chartLine.lineData);
  });

  chart.addTooltip(svg, state.data);
};

chart.parseData = function (data) {
  data.forEach(function (d) {
    d.date = parseTime(d.date);
    d.data = +d.data;
    return d;
  });
};

chart.drawAxis = function (svg, lineData, chartTitle) {
  this.cleanUp();

  x.domain(
    d3.extent(lineData, function (d) {
      return d.date;
    })
  );
  y.domain([
    0,
    d3.max(lineData, function (d) {
      return d.data + 1000;
    }),
  ]);

  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)));

  g.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end");

  g.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(chartTitle);
};

chart.drawLine = function (lineData) {
  g.append("path")
    .attr("class", "chart-line")
    .datum(lineData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
};

chart.addTooltip = function (svg, chartLines) {
  let tooltips = [];
  chartLines.forEach((chartLine) => {
    var focus = g.append("g").attr("class", "focus").style("display", "none");

    focus.append("circle").attr("r", 5);

    focus
      .append("rect")
      .attr("class", "tooltip")
      .attr("width", 120)
      .attr("height", 50)
      .attr("x", 10)
      .attr("y", -22)
      .attr("rx", 4)
      .attr("ry", 4);

    focus
      .append("text")
      .attr("class", "tooltip-date")
      .attr("x", 18)
      .attr("y", -2);

    focus
      .append("text")
      .attr("x", 18)
      .attr("y", 18)
      .text(chartLine.tooltipTitle);

    focus
      .append("text")
      .attr("class", "tooltip-cases")
      .attr("x", 90)
      .attr("y", 18);

    tooltips.push(focus);
  });

  svg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width + 100)
    .attr("height", height)
    .attr("transform", g.attr("transform"))
    .on("mouseover", function () {
      tooltips.forEach((focus) => {
        focus.style("display", null);
      });
    })
    .on("mouseout", function () {
      tooltips.forEach((focus) => {
        focus.style("display", "none");
      });
    })
    .on("mousemove", mousemove);

  function mousemove(event) {
    for (var j = 0; j < chartLines.length; j++) {
      var x0 = x.invert(d3.pointer(event)[0]),
        i = bisectDate(
          chartLines[j].lineData,
          x0,
          1,
          chartLines[j].lineData.length - 1
        ),
        d0 = chartLines[j].lineData[i - 1],
        d1 = chartLines[j].lineData[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      tooltips[j].attr(
        "transform",
        "translate(" + x(d.date) + "," + y(d.data) + ")"
      );
      tooltips[j].select(".tooltip-date").text(dateFormatter(d.date));
      tooltips[j].select(".tooltip-cases").text(d.data);
    }
  }
};

chart.cleanUp = function (el) {
  d3.selectAll(".x-axis").remove();
  d3.selectAll(".y-axis").remove();
  d3.selectAll(".chart-title").remove();
  d3.selectAll(".chart-line").remove();
};

export default chart;
