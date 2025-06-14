import React, { useEffect } from 'react'
import PStatistics from '../../../../components/dashboard/patientDashboard/pStatistics/PStatistics'
import { useSelector } from 'react-redux';
import useDataCall from '../../../../hooks/useDataCall';

const PatientStatistic = () => {
  const { getSingleData } = useDataCall();
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    getSingleData("appointments", userId);
    getSingleData("messages", userId);
  }, [getSingleData, userId]);

  return (
    <div className="main-content">
      <PStatistics/>
    </div>
  )
}

export default PatientStatistic