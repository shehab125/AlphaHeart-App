import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDataCall from "../../../../hooks/useDataCall";
import moment from "moment";

const Termine = ({ date, timeStart, doctorId, isCancelled }) => {
  const { doctors } = useSelector((state) => state.data);
  const { getData } = useDataCall();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchDoctors = async () => {
      if (!doctors?.data?.length) {
      try {
        await getData("doctors");
      } catch (error) {
        console.error("Error fetching doctors:", error);
          if (isMounted) {
            setError(error);
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };
    
    fetchDoctors();
    
    return () => {
      isMounted = false;
    };
  }, []); // Remove getData from dependencies

  let doctorInfo = [];
  if (doctors?.data?.length) {
    doctorInfo = doctors.data.filter((doct) => doct.id === doctorId);
  }

  const formattedDate = moment(date).format("MMMM D, YYYY");
  const formattedTime = moment(timeStart, "HH:mm").format("h:mm A");

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-dark-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 text-red-500">
        Error loading appointment details
      </div>
    );
  }

  return (
    <>
      {isCancelled ? (
        <div className="flex flex-col justify-center items-center border-x-8 border-y-2 border-red-500 mt-4 min-w-[12rem] max-w-[22rem] mx-auto bg-red-50">
          <div className="flex flex-row justify-evenly">
            <h3 className="text-main-dark-blue dark:text-main-light-blue text-lg font-bold line-through decoration-red-500">
              Cancelled Appointment
            </h3>
          </div>
          <div className="flex justify-evenly mt-1">
            <h3 className="mr-20 text-main-dark-blue dark:text-main-light-blue line-through decoration-red-500">
              {formattedDate}
            </h3>
            <h3 className="text-main-dark-blue dark:text-main-light-blue font-bold line-through decoration-red-500">
              {formattedTime}
            </h3>
          </div>
          {doctorInfo[0] && (
            <h3 className="text-main-dark-blue dark:text-main-light-blue mt-2 line-through decoration-red-500">
              Dr. {doctorInfo[0].firstName} {doctorInfo[0].lastName}
            </h3>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center border-x-8 border-y-2 border-main-light-blue2 mt-4 min-w-[12rem] max-w-[22rem] mx-auto bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
          <div className="flex flex-row justify-evenly">
            <h3 className="text-main-dark-blue dark:text-main-light-blue text-lg font-bold">
              Upcoming Appointment
            </h3>
          </div>
          <div className="flex justify-evenly mt-1">
            <h3 className="mr-20 text-main-dark-blue dark:text-main-light-blue">
              {formattedDate}
            </h3>
            <h3 className="text-main-dark-blue dark:text-main-light-blue font-bold">
              {formattedTime}
            </h3>
          </div>
          {doctorInfo[0] && (
            <h3 className="text-main-dark-blue dark:text-main-light-blue mt-2">
              Dr. {doctorInfo[0].firstName} {doctorInfo[0].lastName}
            </h3>
          )}
        </div>
      )}
    </>
  );
};

export default Termine;