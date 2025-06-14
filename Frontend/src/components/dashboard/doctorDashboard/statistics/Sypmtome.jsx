import React from 'react'
import { Chart } from "react-google-charts";

export const data = [
    ["Time Period", "Male", "Female", "Other"],
    ["Cataract", 8, 7, 3],
    ["Laser", 22, 25, 24],
    ["Eye Pain", 11, 11, 2],
  ];
  
  export const options = {
    title: "Symptoms",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Number",
      minValue: 0,
    },
    vAxis: {
      title: "",
    },
    colors: ["#38638D", "#59D4D4", "#5999D7", "#204060"],
    
  };

const Sypmtome = () => {
  return (
    <div>
      <Chart
      chartType="BarChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
    </div>
  )
}

export default Sypmtome