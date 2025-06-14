import React, { useEffect } from 'react'
import PProfile from '../../../../components/dashboard/patientDashboard/pProfile/PProfile'
import useDataCall from '../../../../hooks/useDataCall'
import { useSelector } from 'react-redux'
import Loading from '../../../loading/Loading'

const PatientProfile = () => {
  const { getData } = useDataCall()
  const { user, userId } = useSelector((state) => state.auth)
  const { patients } = useSelector((state) => state.data)

  useEffect(() => {
    getData("patients")
  }, [])

  // Debug logs
  console.log('PatientProfile userId:', userId)
  console.log('PatientProfile patients:', patients)

  // Now patients is the array directly
  const patientsArray = Array.isArray(patients) ? patients : []

  if (!user || !patients) {
    return <Loading />
  }

  if (patientsArray.length === 0) {
    return <div style={{textAlign: 'center', marginTop: '2rem', color: 'red'}}>No patient data found.</div>
  }

  let patientData = patientsArray.find(patient => patient._id === userId || patient.id === userId)
  if (!patientData && patientsArray.length > 0) {
    patientData = patientsArray[0] // fallback to first patient
    console.warn('No patient found with userId, using first patient as fallback:', patientData)
  } else if (!patientData) {
    patientData = user // fallback to user from redux
    console.warn('No patient data found, using redux user as fallback:', patientData)
  }

  return (
    <div>
      <PProfile {...patientData} />
    </div>
  )
}

export default PatientProfile