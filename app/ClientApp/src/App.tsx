import React from "react";
import "./App.css";
import ChartD3 from "./ChartD3";
import data from "./corona-data-fi.json";
// @ts-ignore
import * as _ from "lodash";

interface IPointData {
  date: string;
  data: number;
}

interface IChartLine {
  tooltipTitle: string;
  lineData: IPointData[];
}

function App() {
  let chartData: IChartLine[] = [
    {
      tooltipTitle: "Confirmed",
      lineData: data.data.timeline
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .map((day) => ({
          date: day.date,
          data: day.confirmed,
        })),
    },
    {
      tooltipTitle: "Deaths",
      lineData: data.data.timeline
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .map((day) => ({
          date: day.date,
          data: day.deaths,
        })),
    },
  ];

  return (
    <div className="App">
      <header className="App-header"></header>
      <div>
        <ChartD3
          data={_.cloneDeep(chartData)}
          chartTitle={"COVID-19 numbers in Finland"}
        />
      </div>
    </div>
  );
}

export default App;
