import React from 'react'
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';


export const options = {
  legend: { position: "bottom" },
  chartArea: { left: 15, top: 15, right: 15, bottom: 15 },
  pieSliceText: "label",
  colors: ["#38638D", "#204060", "#59D4D4", "#5999D7"],

};

export let data = [
    ["Status", "Gender", "Age", "Number"],
    ["Attended", "Successful", 12, 3],
    ["Cancelled by Patient", "Cancelled", 20, 6],
    ["Cancelled by Admin", "Cancelled", 7, 7],
    ["Cancelled by Me", "Cancelled", 54, 5],
    
  ]


const CancelStats = () => {

  const { appointments } = useSelector((state) => state.data);

  let receivedAppointments = appointments.filter((app) => {return app.patientId})
  
  let cancelledByPatient = appointments.filter((app) => {return app.cancelUserType === "patient"})
  let byPatient = cancelledByPatient.length

  let cancelledByAdmin = appointments.filter((app) => {return app.cancelUserType === "admin"})
  let byAdmin = cancelledByAdmin.length

  let cancelledByDoctor = appointments.filter((app) => {return app.cancelUserType === "doctor"})
  let byDoctor = cancelledByDoctor.length

  let realizedAppointments = receivedAppointments.length - byPatient - byDoctor - byAdmin
  
  data = [
    ["Status", "Gender", "Age", "Number"],
    ["Attended", "Successful", 12, realizedAppointments],
    ["Cancelled by Patient", "Cancelled", 20, byPatient],
    ["Cancelled by Admin", "Cancelled", 7, byAdmin],
    ["Cancelled by Me", "Cancelled", 54, byDoctor],
    
  ]

  return (
    
    <div className="flex justify-center">
        <Chart
          chartType="PieChart"
          width="95%"
          height="280px"
          data={data}
          options={options}
          chartWrapperParams={{ view: { columns: [0, 3] } }}
          chartPackages={["corechart", "controls"]}
          controls={[
            {
              controlEvents: [
                {
                  eventName: "statechange",
                  callback: ({ chartWrapper, controlWrapper }) => {
                    console.log("State changed to", controlWrapper?.getState());
                  },
                },
              ],
              controlType: "CategoryFilter",
              options: {
                filterColumnIndex: 1,
                ui: {
                  labelStacking: "vertical",
                  label: "Select appointment status",
                  allowTyping: false,
                  allowMultiple: false,
                },
              },
            },
          ]}
        />
    </div>

    
  )
}

export default CancelStats