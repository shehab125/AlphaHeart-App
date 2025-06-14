import React, { useEffect, useRef, useState } from 'react'
import "./pManagement.css"
import { useSelector } from 'react-redux';
import Loading from '../../../../pages/loading/Loading';
import useDataCall from '../../../../hooks/useDataCall';
import PManagementCard from './PManagementCard';

const PManagement = () => {

  const { getData } = useDataCall()
  const { patients } = useSelector((state) => state.data)


  useEffect(() => {
      getData("patients")
  }, [])

  // Debug log to see what patients is
  console.log("Patients data:", patients);

  // Check if patients is an array before mapping
  const patientsArray = Array.isArray(patients) ? patients : [];

  return (
    <>


            <div className="apanel-p-view">


                <div className="apanel-p-view-patientInfo">
                  
                    {patientsArray.length > 0 ? (
                        patientsArray.map((item, i) => <PManagementCard {...item} key={i} />)
                    ) : (
                        <Loading/>
                    )}
                </div>
            </div>


        </>
  )
}

export default PManagement