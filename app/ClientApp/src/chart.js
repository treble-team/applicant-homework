import * as d3 from "d3";

const parseTime = d3.timeParse("%Y-%m-%d");
const bisectDate = d3.bisector(function (d) {
  return d.Date;
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
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

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
      return x(d.Date);
    })
    .y(function (d) {
      return y(d.Confirmed);
    });

  chart.update(state);
};

chart.update = (state) => {
  let svg = d3.select("svg");

  chart.draw(svg, state.data, state.title);
};

chart.draw = function (svg, data, title) {
  this.cleanUp();

  data.forEach(function (d) {
    d.Date = parseTime(d.Date);
    d.Confirmed = +d.Confirmed;
    return d;
  });

  x.domain(
    d3.extent(data, function (d) {
      return d.Date;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.Confirmed + 1000;
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
    .attr("text-anchor", "end")
    .text("Confirmed cases");

  g.append("path")
    .attr("class", "chart-line")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  g.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  var focus = svg.append("g").attr("class", "focus").style("display", "none");

  focus.append("circle").attr("r", 5);

  focus
    .append("rect")
    .attr("class", "tooltip")
    .attr("width", 100)
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

  focus.append("text").attr("x", 18).attr("y", 18).text("Cases:");

  focus
    .append("text")
    .attr("class", "tooltip-cases")
    .attr("x", 60)
    .attr("y", 18);

  svg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function () {
      focus.style("display", null);
    })
    .on("mouseout", function () {
      focus.style("display", "none");
    })
    .on("mousemove", mousemove);

  function mousemove(event) {
    var x0 = x.invert(d3.pointer(event)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
    focus.attr(
      "transform",
      "translate(" + x(d.Date) + "," + y(d.Confirmed) + ")"
    );
    focus.select(".tooltip-date").text(dateFormatter(d.Date));
    focus.select(".tooltip-cases").text(d.Confirmed);
    // focus.select(".tooltip-date").text(dateFormatter(d.Date));
    // focus.select(".tooltip-cases").text(formatValue(d.Confirmed));
  }
};

chart.cleanUp = function (el) {
  d3.selectAll(".x-axis").remove();
  d3.selectAll(".y-axis").remove();
  d3.selectAll(".chart-title").remove();
  d3.selectAll(".chart-line").remove();
};

export default chart;
