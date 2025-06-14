import React from 'react'
import { Chart } from "react-google-charts";

export const data = [
    ["Year", "Number of Appointments"],
    ["December", 1030],
    ["January", 1000],
    ["February", 1170],
    ["March", 660],
  ];
  
  export const options = {
    title: "Number of Appointments - 2024",
    curveType: "function",
    legend: { position: "bottom" },
    colors: ["#38638D", "#59D4D4", "#5999D7", "#204060"],
  };

const WeeklyNumber = () => {
  return (
    <div>
        <Chart
            chartType="LineChart"
            width="100%"
            height="340px"
            data={data}
            options={options}
        />
    </div>
  )
}

export default WeeklyNumber