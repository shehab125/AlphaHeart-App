import React from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import moment from "moment";

export let data = [];

export const options = {
  title: "My Appointments by Branch",
  chartArea: { width: "75%" },
  hAxis: {
    title: "Branch",
    minValue: 0,
  },
  vAxis: {
    title: "Number of Appointments",
  },
  colors: ["#38638D", "#59D4D4", "#5999D7", "#204060"],
  legend: { position: "none" },
  backgroundColor: {
    fill: "#fff",
    fillOpacity: 0.7,
  },
};

const NumberOfAppointments = () => {
  const { appointments } = useSelector((state) => state.data);

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

  const daysInPreviousMonth = new Date(
    previousYear,
    previousMonth,
    0
  ).getDate();
  const previousMonthDate =
    daysInPreviousMonth >= currentDay
      ? `${previousYear}-${previousMonth
          .toString()
          .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`
      : `${previousYear}-${previousMonth
          .toString()
          .padStart(2, "0")}-${daysInPreviousMonth
          .toString()
          .padStart(2, "0")}`;

  //console.log("Previous month date:", previousMonthDate);

  //****************************************************************************************************** */
  let firstDayOfThisYear = currentYear + "-01-01";
  //console.log(firstDayOfThisYear);
  //****************************************************************************************************** */

  let AppsThisWeek = appointments.filter((item) => {
    return item.date <= datumHeute && item.date > getDateOneWeekBefore();
  });
  //console.log(AppsThisWeek)
  let AppsThisMonth = appointments.filter((item) => {
    return item.date <= datumHeute && item.date > previousMonthDate;
  });
   //console.log(AppsThisMonth)
  let AppsThisYear = appointments.filter((item) => {
    return item.date <= datumHeute && item.date > firstDayOfThisYear;
  });
  //console.log(AppsThisYear)

  let thisYearCancelled = 0;
  let lastMonthCancelled = 0;
  let lastWeekCancelled = 0;
  
  // eslint-disable-next-line array-callback-return
  AppsThisYear.map((element) => {
    if (element.isCancelled === true) {
       (thisYearCancelled += 1);
    }
    return thisYearCancelled;
  });
  // eslint-disable-next-line array-callback-return
  AppsThisWeek.map((element) => {
    if (element.isCancelled === true) {
      lastWeekCancelled += 1;
    }
    return lastWeekCancelled;
  });
    // eslint-disable-next-line array-callback-return
    AppsThisMonth.map((element) => {
      if (element.isCancelled === true) {
        //console.log(lastMonthCancelled);
        (lastMonthCancelled += 1);
      }
      return lastMonthCancelled;
    });
  

  // console.log(lastMonthCancelled);
  // console.log(lastWeekCancelled);
  // console.log(thisYearCancelled);

  data = [
    ["Previous appointment status by time", "Attended", "Cancelled"],
    [
      "Last 7 days",
      AppsThisWeek?.length - lastWeekCancelled,
      lastWeekCancelled,
    ],
    [
      "Last 30 days",
      AppsThisMonth?.length - lastMonthCancelled,
      lastMonthCancelled,
    ],
    [currentYear, AppsThisYear.length - thisYearCancelled, thisYearCancelled],
  ];

  return (
    <div className="pt-10">
      <Chart
        chartType="ColumnChart"
        height="360px"
        data={data}
        options={options}
      />
    </div>
  );
};
export default NumberOfAppointments;
