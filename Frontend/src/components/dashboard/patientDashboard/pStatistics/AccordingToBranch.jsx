import React from 'react'
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';

export let data = [];

export const options = {
  title: "My Appointments by Branch",
  colors: ["#38638D", "#59D4D4", "#204060", "#5999D7", "#237979"],
  legend: { position: "bottom" },
  pieHole: 0.4,
  is3D: false,
  backgroundColor: {
    fill: "#fff",
    fillOpacity: 0.7,
  },
};

const AccordingToBranch = () => {
    const { doctors, appointments } = useSelector((state) => state.data);
    //console.log(doctors)

    let doctorsOfThispatient = []
    let branchesOfthisDoctors = []

    for (let i = 0; i < appointments.length; i++){
        doctorsOfThispatient.push(...doctors?.data?.filter((doct) => {
            return doct.id === appointments[i].doctorId
        }))
    }
    //console.log(doctorsOfThispatient)
    
    for (let i = 0; i < doctorsOfThispatient.length; i++){
        branchesOfthisDoctors.push(
          doctorsOfThispatient[i].branch
        );
    }

    //console.log(branchesOfthisDoctors);

    function countOccurrences(arr) {
      const counts = {};

      // Count occurrences of each name
      arr.forEach((name) => {
        counts[name] = (counts[name] || 0) + 1;
      });

      // Convert object into array of arrays
      const result = [["Branche", "Number of Appointments"]];
      for (const name in counts) {
        result.push([name, counts[name]]);
      }

      return result;
    }

    let data = countOccurrences(branchesOfthisDoctors)

      return (
        <div> 
          <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width="100%"
            height={"366px"}
          />
        </div>
      );
}

export default AccordingToBranch