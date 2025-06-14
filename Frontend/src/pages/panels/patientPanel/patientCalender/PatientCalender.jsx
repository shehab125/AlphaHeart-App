import React, { useEffect, useState } from "react";
import PKalender from "../../../../components/dashboard/patientDashboard/pKalender/PKalender";
import { useSelector } from "react-redux";
import useDataCall from "../../../../hooks/useDataCall";

const PatientCalender = () => {
  const { userId } = useSelector((state) => state.auth);
  const { getSingleData } = useDataCall();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch patient-specific appointments
        await getSingleData("appointments", userId);
        await getSingleData("events", userId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [getSingleData, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-main-dark-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <PKalender />
    </div>
  );
};

export default PatientCalender;
