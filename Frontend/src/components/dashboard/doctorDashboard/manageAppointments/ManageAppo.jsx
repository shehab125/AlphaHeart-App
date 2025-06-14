import React, { useEffect, useState } from 'react'
import ManageDays from './ManageDays'
import { useSelector } from 'react-redux'
import useDataCall from '../../../../hooks/useDataCall'
import ShowDays from './ShowDays'

const ManageAppo = ({id}) => {

    const {weekdays} = useSelector((state)=>state.data)
    const {getData} = useDataCall()
    const doctor_id = id;
    //console.log(id)

    useEffect(() => {

        getData("weekdays")
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      

    const days = ["-----", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const hours = ["--:--", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", 
    "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30","09:00", "09:30",
    "10:00",  "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",  "13:30", "14:00", "14:30", "15:00",  "15:30",
    "16:00",  "16:30", "17:00",  "17:30", "18:00",  "18:30", "19:00",  "19:30", "20:00",  "20:30", "21:00",  "21:30", 
    "22:00",  "22:30", "23:00",  "23:30", 
    ]
    const dauer = ["---", "5 Min", "10 Min", "15 Min", "20 Min", "30 Min", "60 Min"]

    const dateToday = new Date().toISOString().split("T")[0]
    //console.log(dateToday)

    const [firstDate, setFirstDate] = useState("")
    const [secondDate, setSecondDate] = useState("")
    const [isLaterThan, setIsLaterThan] = useState(true)
    
    const [isDateSelected, setIsDateSelected] = useState(true)

    //const [isChecked, setIsChecked] = useState(false)


    const handleDateControl = (e) => {
        e.preventDefault()
        setSecondDate(e.target.value)
        if(secondDate <= firstDate){
            setIsLaterThan(false)
        }
        else{
            setIsLaterThan(true)
        }
        // firstDateChosen = firstDate
        // secondDateChosen = secondDate
    }

    let weekDaysThisDoctor = weekdays.filter((weekD)=>weekD.doctorId === doctor_id)

    

    

    useEffect(() => {
        
     
        if(weekDaysThisDoctor.length === 0){
            setIsDateSelected(false)
        }
        else{
            setIsDateSelected(true)
            setFirstDate(weekDaysThisDoctor[0].startingDate)
            setSecondDate(weekDaysThisDoctor[0].endingDate)
        }
        
    
    }, [weekDaysThisDoctor])
    
    


    // const submitDateSelect = (e) => {
    //     e.preventDefault()
    //     setIsDateSelected(true)
    // }

    
  return (
    <div className="main-content">
        <div className="d-man-appo-main">
      <div className='bg-white rounded-3xl pb-[120px] flex flex-col shadow-lg'>
        {/* Section 1: Select Appointment Period */}
        <div className='mb-8 border-b-2 border-main-light-blue pb-6'>
          <h2 className='text-2xl font-bold text-main-dark-blue mb-2'>1. Select Appointment Period</h2>
        {weekDaysThisDoctor.length === 0 && <>
            <div className='flex justify-center items-center'>
              <div className='bg-blue-50 w-[70vw] p-5 rounded-xl shadow'>
                <h3 className='text-lg text-gray-700'>Once you have selected the date range for your appointments, you cannot <span className='underline'>change it</span>. Therefore, before creating your appointments, you should <span className='underline'>carefully decide</span> which time period you want to use our application. The created appointments will only become available again when your first appointment period ends. For example, if you create an appointment for a 6-month project period, you cannot create another appointment within this period.</h3>
                    </div>
                </div>
            <div className='flex justify-center items-center min-w-[250px] mx-auto rounded-xl mt-2'>
                    <div className='min-w-[250px] p-5'>
                        <h3 className='text-red-600 text-lg'>I have read and agree to this.</h3>
                    </div>
              <input type="checkbox" className='w-[1.5rem] h-[1.5rem] border-2 border-main-dark-blue rounded' />
            </div>
          </>}
          <form className="mx-auto mt-8">
            <div className='flex flex-col md:flex-row justify-center items-center gap-8'>
              <div className='flex flex-col items-center'>
                <label htmlFor="grid-von-datum" className='font-semibold text-main-dark-blue mb-1'>From</label>
                {isDateSelected ?
                  <input disabled value={firstDate} onChange={(e)=>setFirstDate(e.target.value)} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id="grid-von-datum" type="date" min={dateToday} max="2025-12-31" />
                            :
                  <input value={firstDate} onChange={(e)=>setFirstDate(e.target.value)} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id="grid-von-datum" type="date" min={dateToday} max="2025-12-31" />
                        }
                    </div>
              <div className='flex flex-col items-center'>
                <label htmlFor="grid-bis-datum" className='font-semibold text-main-dark-blue mb-1'>To</label>
                {isDateSelected ?
                  <input disabled value={secondDate} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white' id="grid-bis-datum" type="date" min={dateToday} max="2025-12-31" />
                            : 
                  <input value={secondDate} onChange={handleDateControl} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white' id="grid-bis-datum" type="date" min={dateToday} max="2025-12-31" />
                    }
                </div>
            </div>
            {!isLaterThan && <p className='text-red-600 italic text-center mt-2'>The second date cannot be before the first date.</p>}
          </form>
        </div>
        {/* Section 2: Set Weekly Working Hours */}
        <div className='mb-8 border-b-2 border-main-light-blue pb-6'>
          <h2 className='text-2xl font-bold text-main-dark-blue mb-2'>2. Set Weekly Working Hours</h2>
          <h3 className='text-lg mx-auto text-gray-700 mb-4'>Please enter your weekly working hours below to create your appointments:</h3>
                <ManageDays hours={hours} dauer={dauer} days={days} doctor_id={doctor_id} firstDate={firstDate} secondDate={secondDate}/>
        </div>
        {/* Section 3: Review & Manage Days */}
        <div>
          <h2 className='text-2xl font-bold text-main-dark-blue mb-2'>3. Review & Manage Days</h2>
          {weekDaysThisDoctor.map((item, index) => (
            <div key={index} className='w-full mb-4'>
                                    <ShowDays {...item} doctor_id={doctor_id}/>
            </div>
          ))}
                </div>
        </div>
        </div>
    </div>
  )
}

export default ManageAppo