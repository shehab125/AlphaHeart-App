import React, { useEffect } from 'react'
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import useDataCall from '../../../../hooks/useDataCall';


export let data = [
  ["Gender", "Rate"],
  ["Female", 11],
  ["Male", 2],
  ["Other", 2],
   // CSS-style declaration
];

export const options = {
  legend: { position: "bottom" },
  title: "Patient Gender Distribution",
  pieHole: 0.4,
  is3D: false,
  colors: ["#38638D", "#204060", "#59D4D4", "#5999D7"],
};

const GenderStats = () => {
  
  const { appointments, patients } = useSelector((state) => state.data);
  

  let relevantPatients = []

  let receivedAppointments = appointments.filter((app) => {return app.patientId})

  receivedAppointments.map(element => { 
    return relevantPatients.push(...patients.filter((item) => {return item.id === element.patientId.id}))
  });
  console.log(relevantPatients);

  let manCount = 0
  let womanCount = 0
  let genderlessCount = 0

  relevantPatients.map((pat) => {
    if(pat.gender === "Male") return manCount += 1;
    if(pat.gender === "Female") return womanCount += 1;
    else return genderlessCount += 1;
  })

  data = [
    ["Gender", "Rate"],
    ["Female", womanCount],
    ["Male", manCount],
    ["Other", genderlessCount],
     // CSS-style declaration
  ];

  return (
    <div>
      <Chart
        chartType="PieChart"
        width="100%"
        height="320px"
        data={data}
        options={options}
      />
    </div>

  )
}

export default GenderStats

