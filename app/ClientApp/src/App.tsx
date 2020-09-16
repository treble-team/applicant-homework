import React from "react";
import "./App.css";
import BarChart from "./BarChart";
import ChartD3 from "./ChartD3";
import data from "./corona-data-fi.json";
// @ts-ignore
import * as _ from "lodash";

function App() {
  const numberData = data.data.timeline
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map((day) => ({
      Date: day.date,
      Confirmed: day.confirmed,
    }));

  var content = (
    <ChartD3
      data={_.cloneDeep(numberData)}
      title={"Confirmed Covid cases in Finland"}
    />
  );

  return (
    <div className="App">
      <header className="App-header"></header>
      <div id="testing">
        <BarChart></BarChart>
      </div>

      {content}
    </div>
  );
}

export default App;
