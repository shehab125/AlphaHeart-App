import React from 'react'
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import moment from "moment";

export let data = [
  ["Number of Appointments by Gender", "Male", "Female", "Other"],
  ["Daily", 8, 7, 3],
  ["Weekly", 22, 25, 24],
  ["Monthly", 116, 111, 32],
];

export const options = {
  title: "Number of Appointments by Gender",
  chartArea: { width: "60%" },
  colors: ["#38638D", "#59D4D4", "#5999D7", "#204060"],
  legend: { position: "bottom" },
};

const NumberOfAppointments = () => {

  const {patients, appointments} = useSelector((state)=>state.data)
  

  
  const datumHeute = moment().format("YYYY-MM-DD");

  //******************************************************************************************* */

  function getDateOneWeekBefore() {
    var today = new Date();
    var oneWeekBefore = new Date(today);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
    return oneWeekBefore.toISOString().split("T")[0];
  }

  //console.log(getDateOneWeekBefore());

//****************************************************************************************************** */

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // January is 0, so add 1
const currentDay = currentDate.getDate();

let previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
let previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

const daysInPreviousMonth = new Date(previousYear, previousMonth, 0).getDate();
const previousMonthDate = daysInPreviousMonth >= currentDay
    ? `${previousYear}-${previousMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`
    : `${previousYear}-${previousMonth.toString().padStart(2, '0')}-${daysInPreviousMonth.toString().padStart(2, '0')}`;

//console.log("Previous month date:", previousMonthDate);

//****************************************************************************************************** */

  let todayApps = appointments.filter((item) => {return item.date === datumHeute})
  //console.log(todayApps)
  let AppsThisWeek = appointments.filter((item) => {return item.date <= datumHeute && item.date > getDateOneWeekBefore(); })
  //console.log(AppsThisWeek)
  let AppsThisMonth = appointments.filter((item) => {return item.date <= datumHeute && item.date > previousMonthDate })
  //console.log(AppsThisMonth)

  let relevantPatients = []
  let relevantPatientsWeekly = []
  let relevantPatientsMonthly = []

  let receivedAppointmentsToday = todayApps.filter((app) => {return app.patientId})
  let receivedAppointmentsThisWeek = AppsThisWeek.filter((app) => {return app.patientId})
  let receivedAppointmentsThisMonth = AppsThisMonth.filter((app) => {return app.patientId})

  receivedAppointmentsToday.map(element => { 
    return relevantPatients.push(...patients.filter((item) => {return item.id === element.patientId.id}))
  });
  receivedAppointmentsThisWeek.map(element => { 
    return relevantPatientsWeekly.push(...patients.filter((item) => {return item.id === element.patientId.id}))
  });
  receivedAppointmentsThisMonth.map(element => { 
    return relevantPatientsMonthly.push(...patients.filter((item) => {return item.id === element.patientId.id}))
  });

  let manCountToday = 0
  let womanCountToday = 0
  let genderlessCountToday = 0
  let manCountThisWeek = 0
  let womanCountThisWeek = 0
  let genderlessCountThisWeek = 0
  let manCountThisMonth = 0
  let womanCountThisMonth = 0
  let genderlessCountThisMonth = 0

  relevantPatients.map((pat) => {
    if(pat.gender === "Male") return manCountToday += 1;
    if(pat.gender === "Female") return womanCountToday += 1;
    else return genderlessCountToday += 1;
  })
  relevantPatientsWeekly.map((pat) => {
    if(pat.gender === "Male") return manCountThisWeek += 1;
    if(pat.gender === "Female") return womanCountThisWeek += 1;
    else return genderlessCountThisWeek += 1;
  })
  relevantPatientsMonthly.map((pat) => {
    if(pat.gender === "Male") return manCountThisMonth += 1;
    if(pat.gender === "Female") return womanCountThisMonth += 1;
    else return genderlessCountThisMonth += 1;
  })

  data = [
    ["Number of Appointments by Gender", "Male", "Female", "Other"],
    ["Daily", manCountToday, womanCountToday, genderlessCountToday],
    ["Last 7 Days", manCountThisWeek, womanCountThisWeek, genderlessCountThisWeek],
    ["Last 30 Days", manCountThisMonth, womanCountThisMonth, genderlessCountThisMonth],
  ];

  return (
    <div className='pl-10 pt-10'>
      <Chart
      chartType="Bar"
      width="100%"
      height="360px"
      data={data}
      options={options}
    />
    </div>

  )
}

export default NumberOfAppointments