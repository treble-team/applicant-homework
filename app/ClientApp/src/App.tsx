import React from "react";
import "./App.css";
import ChartD3 from "./ChartD3";
import data from "./corona-data-fi.json";
// @ts-ignore
import * as _ from "lodash";

interface PointData {
  Date: string;
  Data: number;
}

interface ChartLine {
  title: string;
  data: PointData[];
}

function App() {
  let chartData: ChartLine[] = [
    {
      title: "Confirmed",
      data: data.data.timeline
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .map((day) => ({
          Date: day.date,
          Data: day.confirmed,
        })),
    },
    {
      title: "Deaths",
      data: data.data.timeline
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .map((day) => ({
          Date: day.date,
          Data: day.deaths,
        })),
    },
    {
      title: "recovered",
      data: data.data.timeline
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .map((day) => ({
          Date: day.date,
          Data: day.recovered,
        })),
    },
  ];

  return (
    <div className="App">
      <header className="App-header"></header>
      <div>
        <ChartD3
          data={_.cloneDeep(chartData)}
          title={"COVID-19 numbers in Finland"}
        />
      </div>
    </div>
  );
}

export default App;
