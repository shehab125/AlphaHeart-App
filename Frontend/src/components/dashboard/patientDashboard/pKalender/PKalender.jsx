import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "../../doctorDashboard/kalender/calendar.css";
import { useSelector } from "react-redux";
import Events from "./Events";
import moment from "moment";
import TerminInfo from "../Uberblick/TerminInfo";
import Termine from "../Uberblick/Termine";
import useDataCall from '../../../../hooks/useDataCall';

const PKalender = () => {
  const { getSingleData } = useDataCall();
  const { appointments } = useSelector((state) => state.data);
  const { userId } = useSelector((state) => state.auth);
  const [termin, setTermin] = useState(null);
  const dateToday = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(dateToday);
  const [appsThisPatientSelectedDate, setAppsThisPatientSelectedDate] = useState([]);

  useEffect(() => {
    if (appointments && userId) {
      // Filter appointments for today on initial load
      const todayApps = appointments.filter((item) => 
        moment(item.date).format("YYYY-MM-DD") === dateToday && 
        item.patientId === userId && 
        !item.isCancelled
      );
      setAppsThisPatientSelectedDate(todayApps || []);
    }
  }, [appointments, dateToday, userId]);

  const handleDateSelect = (value) => {
    const selectedDateStr = moment(value).format("YYYY-MM-DD");
    setSelectedDate(selectedDateStr);
    
    if (appointments && userId) {
      // Filter appointments for the selected date and current patient
      const selectedDateApps = appointments.filter((item) => 
        moment(item.date).format("YYYY-MM-DD") === selectedDateStr && 
        item.patientId === userId && 
        !item.isCancelled
      );
      
      setAppsThisPatientSelectedDate(selectedDateApps || []);
    }
  };

  const tileClassName = ({ date }) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    const hasAppointment = appointments?.some(
      (app) => moment(app.date).format("YYYY-MM-DD") === dateStr && 
      app.patientId === userId && 
      !app.isCancelled
    );
    return hasAppointment ? "has-appointment" : null;
  };

  // Add a function to refresh patient appointments
  const refreshAppointments = async () => {
    if (userId) {
      await getSingleData('appointments', userId);
    }
  };

  // Make refreshAppointments globally accessible
  useEffect(() => {
    window.refreshPatientAppointments = refreshAppointments;
    return () => { window.refreshPatientAppointments = null; };
  }, [refreshAppointments]);

  return (
    <div className="p-calender-main">
      <div className="p-calender-box flex justify-center rounded-3xl">
        <div className="p-calender-left bg-white w-[100%] rounded-l-3xl h-[820px] border-r-[1.9rem] border-main-light-blue flex flex-col">
          <div className="min-h-[10vh] text-4xl font-bold flex justify-center items-center border-b-8 border-main-dark-blue">
            <h1 className="text-main-dark-blue">Calendar</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 ml-5 text-main-dark-blue"
            >
              <path
                fillRule="evenodd"
                d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <Calendar
              className="react-calendar2 mx-auto mt-12"
              defaultView="month"
              locale="en-US"
              onChange={handleDateSelect}
              value={new Date(selectedDate)}
              tileClassName={tileClassName}
            />
          </div>
            <div className="p-calender-main-termin flex flex-row">
              <div className="p-calender-termin overflow-scroll p-2 h-[650px]">
                {appsThisPatientSelectedDate?.length > 0 ? (
                  appsThisPatientSelectedDate.map((appo, index) => (
                    <div key={index}>
                      <div
                        className="w-full hover:cursor-pointer"
                        onClick={() => setTermin(appo)}
                      >
                        <Termine {...appo} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center mt-4">
                    <h2 className="text-xl text-gray-600">
                      No appointments scheduled for {selectedDate}
                    </h2>
                  </div>
                )}
              </div>
              <div className="rounded-3xl flex justify-center ml-4">
                <TerminInfo termin={termin} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PKalender;
