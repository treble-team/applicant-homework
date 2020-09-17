import "./App.css";

// @ts-ignore
import * as _ from "lodash";
import React from "react";

import ChartD3 from "./ChartD3";
import useApiService, { CoronaObject } from "./apiService";

interface IPointData {
  date: string;
  data: number;
}

interface IChartLine {
  tooltipTitle: string;
  lineData: IPointData[];
}

const App: React.FC = () => {
  const service = useApiService();

  const getData = (data: CoronaObject[]): IChartLine[] => {
    var result = [
      {
        tooltipTitle: "Confirmed",
        lineData: data
          .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
          .map((day) => ({
            date: day.date.substring(0, 10),
            data: day.confirmed,
          })),
      },
      {
        tooltipTitle: "Deaths",
        lineData: data
          .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
          .map((day) => ({
            date: day.date.substring(0, 10),
            data: day.deaths,
          })),
      },
    ];

    return result;
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <div>
        {service.status === "loading" && <div>Loading...</div>}
        {service.status === "loaded" && (
          <ChartD3
            data={_.cloneDeep(getData(service.payload))}
            chartTitle={"COVID-19 numbers in Finland"}
          />
        )}
        {service.status === "error" && <div>Error loading the data.</div>}
      </div>
    </div>
  );
};

export default App;
