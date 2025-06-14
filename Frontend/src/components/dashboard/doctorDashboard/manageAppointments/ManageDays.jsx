import React, { useEffect, useState } from 'react'
import useDataCall from '../../../../hooks/useDataCall';
import { useSelector } from 'react-redux';

const ManageDays = ({hours, dauer, days, doctor_id, firstDate, secondDate}) => {
    const [name, setName] = useState("")
    const [startHour, setStartHour] = useState("")
    const [finishHour, setFinishHour] = useState("")
    const [lunchStart, setLunchStart] = useState("")
    const [lunchFinish, setLunchFinish] = useState("")
    const [appointmentDuration, setAppointmentDuration] = useState("")
    const [feedback, setFeedback] = useState("");

    const {postData, getData} = useDataCall()

    const {weekdays} = useSelector((state)=>state.data)

    const handleCreateWeekday = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!name || !startHour || !finishHour || !lunchStart || !lunchFinish || !appointmentDuration) {
            setFeedback("Please fill in all required fields");
            return;
        }

        // Validate time order
        if (startHour >= finishHour) {
            setFeedback("Day end time must be after day start time");
            return;
        }

        if (lunchStart >= lunchFinish) {
            setFeedback("Break end time must be after break start time");
            return;
        }

        if (lunchStart <= startHour || lunchFinish >= finishHour) {
            setFeedback("Break time must be within working hours");
            return;
        }

        // Validate dates
        if (!firstDate || !secondDate) {
            setFeedback("Please select valid date range");
            return;
        }

        // Validate date format
        try {
            new Date(firstDate);
            new Date(secondDate);
        } catch (error) {
            setFeedback("Invalid date format");
            return;
        }

        // Validate date range
        if (new Date(firstDate) > new Date(secondDate)) {
            setFeedback("End date must be after start date");
            return;
        }

        // Validate doctor ID
        if (!doctor_id) {
            setFeedback("Doctor ID is required");
            return;
        }

        // Validate appointment duration
        const duration = parseInt(appointmentDuration.split(" ")[0]);
        if (isNaN(duration) || duration <= 0) {
            setFeedback("Invalid appointment duration");
            return;
        }

        // Prepare data
        const weekdayData = {
            doctorId: doctor_id,
            name: name,
            startHour: startHour,
            finishHour: finishHour,
            lunchStart: lunchStart,
            lunchFinish: lunchFinish,
            appointmentDuration: duration,
            isFilled: true,
            startingDate: firstDate,
            endingDate: secondDate
        };

        // Log the data being sent
        console.log("Sending weekday data:", weekdayData);

        try {
            setFeedback("Creating weekday...");
            const response = await postData("weekdays", weekdayData);
            
            // Log the response
            console.log("Server response:", response);
            
            if (response?.data) {
                // Reset form
                setName("");
                setStartHour("");
                setFinishHour("");
                setLunchStart("");
                setLunchFinish("");
                setAppointmentDuration("");
                
                setFeedback("Weekday created successfully!");
            }
        } catch (error) {
            console.error("Error creating weekday:", error);
            
            // Extract error message from Axios error response
            let errorMessage = "Error creating weekday. Please try again.";
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                console.error("Error response headers:", error.response.headers);
                
                // Try to get detailed error message from server
                const serverError = error.response.data?.message || 
                                  error.response.data?.error || 
                                  error.response.data?.detail ||
                                  error.response.data?.errorMessage;
                
                if (serverError) {
                    errorMessage = `Server error: ${serverError}`;
                } else {
                    errorMessage = `Server error (${error.response.status}): ${error.response.statusText}`;
                }

                // Log the full error response for debugging
                console.error("Full error response:", {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers
                });
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error request:", error.request);
                errorMessage = "No response from server. Please check your connection.";
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error message:", error.message);
                errorMessage = error.message;
            }
            
            setFeedback(errorMessage);
            
            // Don't reset form on error
            return;
        }
    }

    // Add useEffect to clear feedback message after 5 seconds
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => {
                if (feedback.includes("success")) {
                    setFeedback("");
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    useEffect(() => {
        getData("weekdays")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    let weekDaysThisDoctor = weekdays.filter((weekD)=>weekD.doctorId === doctor_id)
    let fullDays = weekDaysThisDoctor.map((tag) => {return tag.name})
    let remainedDays = days.filter((element) => !fullDays.includes(element))
    
  return (
    <div className='d-man-tag-main2 w-full max-w-4xl flex flex-col justify-center items-center mb-12 mt-5'>
            {/* Feedback message */}
            {feedback && (
                <div 
                    className={`mb-4 p-2 rounded text-center w-full ${
                        feedback.includes('success') 
                            ? 'bg-green-100 text-green-700' 
                            : feedback.includes('Creating') 
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                    }`}
                >
                    {feedback}
                </div>
            )}
      <div className="w-full bg-blue-50 rounded-lg shadow p-4 flex flex-wrap md:flex-row flex-col items-center justify-center gap-4 mb-6">
        <div className="flex flex-col items-center min-w-[120px] w-full sm:w-auto mb-2 sm:mb-0">
          <label className="font-semibold text-main-dark-blue mb-1 text-sm sm:text-base">Day</label>
          {remainedDays.length > 0 ? (
                    <select 
                        value={name}
                        onChange={(e)=>setName(e.target.value)} 
                        name="tag" 
              className="block appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-2 pr-5 rounded leading-tight focus:outline-none focus:bg-white focus:border-main-dark-blue w-full" 
                        id="grid-state1"
                    >
                        <option value="">Select a day</option>
                        {remainedDays.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
          ) : (
            <div className="text-gray-500 italic">All days have been added</div>
          )}
                    </div>
        <div className="flex flex-col items-center min-w-[120px] w-full sm:w-auto mb-2 sm:mb-0">
          <label className="font-semibold text-main-dark-blue mb-1 text-sm sm:text-base">Day Start</label>
                            <select 
                                value={startHour}
                                onChange={(e)=>setStartHour(e.target.value)} 
                                name="startHour" 
            className="block appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-2 pr-5 rounded leading-tight focus:outline-none focus:bg-white focus:border-main-dark-blue w-full" 
                                id="grid-state2"
                            >
                                <option value="">Select time</option>
                                {hours.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                    </select>
                    </div>
        <div className="flex flex-col items-center min-w-[120px] w-full sm:w-auto mb-2 sm:mb-0">
          <label className="font-semibold text-main-dark-blue mb-1 text-sm sm:text-base">Day End</label>
                            <select 
                                value={finishHour}
                                onChange={(e)=>setFinishHour(e.target.value)} 
            className="block appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-2 pr-5 rounded leading-tight focus:outline-none focus:bg-white focus:border-main-dark-blue w-full" 
                                id="grid-state3"
                            >
                                <option value="">Select time</option>
                                {hours.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                    </select>
                    </div>
        <div className="flex flex-col items-center min-w-[120px] w-full sm:w-auto mb-2 sm:mb-0">
          <label className="font-semibold text-main-dark-blue mb-1 text-sm sm:text-base">Lunch Break</label>
                            <select 
                                value={lunchStart}
                                onChange={(e)=>setLunchStart(e.target.value)} 
            className="block appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-2 pr-5 rounded leading-tight focus:outline-none focus:bg-white focus:border-main-dark-blue w-full" 
                                id="grid-state4"
                            >
                                <option value="">Select time</option>
                                {hours.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                    </select>
                    </div>
        <div className="flex flex-col items-center min-w-[120px] w-full sm:w-auto mb-2 sm:mb-0">
          <label className="font-semibold text-main-dark-blue mb-1 text-sm sm:text-base">Break End</label>
                            <select 
                                value={lunchFinish}
                                onChange={(e)=>setLunchFinish(e.target.value)} 
            className="block appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-2 pr-5 rounded leading-tight focus:outline-none focus:bg-white focus:border-main-dark-blue w-full" 
                                id="grid-state5"
                            >
                                <option value="">Select time</option>
                                {hours.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                            </div>
        <div className="flex flex-col items-center min-w-[140px] w-full sm:w-auto mb-2 sm:mb-0">
          <label className="font-semibold text-main-dark-blue mb-1 text-sm sm:text-base">Appointment Duration</label>
                            <select 
                                value={appointmentDuration}
                                onChange={(e)=>setAppointmentDuration(e.target.value)} 
            className="block appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-2 pr-5 rounded leading-tight focus:outline-none focus:bg-white focus:border-main-dark-blue w-full" 
                                id="grid-state6"
                            >
                                <option value="">Select duration</option>
                                {dauer.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                    </select>
            </div>
                    <button 
                        onClick={handleCreateWeekday}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition w-full sm:w-auto mt-4 sm:mt-6 md:mt-0"
          disabled={remainedDays.length === 0}
                    >
                        CREATE
                    </button>
                </div>
    </div>
  )
}

export default ManageDays