import React from 'react'
import UserPNG from '../../../../assets/user.png'
import locationIcon from '../../../../assets/locationIcon.png'
import phoneIcon from '../../../../assets/phone.png'
import DeleteAppoModal from '../kalender/DeleteAppoModal'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PatientInfo = ({patient, todayAppsThisDoctor, termin}) => {
    
    const navigate = useNavigate()
    const {patients} = useSelector(state=>state.data)
   
      //console.log(termin)
    const patientInfo = patients?.filter(item =>item.id===patient.patientId)

    console.log("PATIENT:",patient);

      const URL = process.env.REACT_APP_BASE_URL;
      const fileImage =
        patient?.profilePic && `${URL}/uploads/${patient.profilePic}`;
    
      const [showModal, setShowModal] = React.useState(false);

  return (
    <div className='flex flex-col justify-center items-center'>
        {
            patient ? 
            <>
                <img src={fileImage || UserPNG} alt="Patient" className='w-[7rem] h-[7rem] mt-3'/>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-2xl mb-5 text-[#38638D]'>{patientInfo[0]?.firstName} {patientInfo[0]?.lastName}</h1>
                    <h1 className='text-xl mb-2'>Appointment: {patient?.timeStart}</h1>
                    <h1 className='text-xl mb-5'>Complaints: {patient?.complaints}</h1>

                    <div className='flex justify-start'>
                        <img src={locationIcon} className="mr-2 w-4 h-6" alt="locationIcon" />
                        <h1 className='text-lg'>{patientInfo[0]?.street}, {patientInfo[0]?.zipCode} </h1>
                     </div>
                    <div className='flex'>
                        <img src={phoneIcon} className="mr-1 w-5 h-5" alt="phoneIcon" />
                        <h1 className='text-lg'>{patientInfo[0]?.phone} </h1>
                    </div>
                    {
                        patient?.isCancelled  && <h1 className='absolute text-5xl text-red-600 font-bold opacity-10'>CANCELLED</h1>
                    }
                </div>
                    {
                            patient?.isCancelled ? 
                                <div>
                                    {
                                        patient?.cancelUserType === "patient" ? 
                                            <h1 className='text-red-600 mt-10 text-md font-bold px-10'>Appointment has been cancelled by the patient.</h1>
                                        :
                                            (
                                                patient?.cancelUserType === "admin" ?
                                                    <h1 className='text-red-600 mt-10 text-lg font-bold'>Appointment has been cancelled by the Website Admin.</h1>
                                                :
                                                    <h1 className='text-red-600 mt-10 text-lg font-bold'>Appointment has been cancelled by you.</h1>
                                            )
                                    }
                                    <h1 className='text-main-dark-blue text-xl ml-10 mt-5 mb-10'><span className='font-bold text-main-dark-blue'>Cancellation Reason:</span> {patient?.cancelReason}</h1>
                                </div>
                            :
                                <div className='p-view-btn flex justify-evenly items-center w-[20vw] ml-3'>
                                    <button onClick={() => navigate("message")} className='p-view-btn1 mt-10 bg-sky-600 text-white text-lg py-3 px-4 rounded-xl hover:bg-sky-700 duration-150'>SEND MESSAGE</button>
                                    <button onClick={()=>setShowModal(true)} className='p-view-btn2 mt-10 bg-red-600 text-white text-lg py-3 px-4 rounded-xl hover:bg-red-700 duration-150'>CANCEL</button>
                                </div>
                        }
 
            </>
            :
            <div className='text-center'>
                <h1 className='mt-20 text-2xl'>This appointment is free. Please click on a patient name on the left to see their information.</h1>
            </div>
            
        }
            <DeleteAppoModal showModal={showModal} setShowModal={setShowModal} termin={patient} patientInfo={patientInfo}/>
           </div>
  )
}

export default PatientInfo