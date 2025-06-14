import React, { useEffect } from 'react'
import DProfile from '../../../../components/dashboard/doctorDashboard/profil/DProfile'
import Loading from '../../../loading/Loading'
import useDataCall from '../../../../hooks/useDataCall'
import { useSelector } from 'react-redux'

const DoctorProfile = () => {
  const { getData } = useDataCall()
  const { user, userId } = useSelector((state) => state.auth)
  const { doctors } = useSelector((state) => state.data)

  useEffect(() => {
    if (!doctors || !Array.isArray(doctors) || !doctors.find(doc => doc._id === userId)) {
    getData("doctors")
    }
  }, [userId, doctors, getData])

  // Debug logs
  console.log('DoctorProfile userId:', userId)
  console.log('DoctorProfile doctors:', doctors)
  console.log('DEBUG doctors object:', doctors)

  // Now doctors is the array directly
  const doctorsArray = Array.isArray(doctors)
    ? doctors
    : (doctors?.data
        ? doctors.data
        : (doctors && doctors._id ? [doctors] : []));

  if (!user || !doctors) {
    return <Loading />
  }

  if (doctorsArray.length === 0) {
    return <div style={{textAlign: 'center', marginTop: '2rem', color: 'red'}}>No doctor data found.</div>
  }

  let doctorData = doctorsArray.find(doctor => doctor._id === userId || doctor.id === userId)
  if (!doctorData && user && user._id === userId) {
    doctorData = user
  }
  if (!doctorData) {
    return <div style={{textAlign: 'center', marginTop: '2rem', color: 'red'}}>No doctor data found.</div>
  }

  return (
    <div>
      <DProfile {...doctorData} />
    </div>
  )
}

export default DoctorProfile