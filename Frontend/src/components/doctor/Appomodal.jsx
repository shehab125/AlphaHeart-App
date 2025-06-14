import React, { useState } from "react";
import useDataCall from "../../hooks/useDataCall";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux";
import { getDataSuccess } from "../../features/dataSlice";

export default function Modal({showModal, setShowModal, date, doctorName, time, address, patientName, appoId, patientId, doctorId}) {
  const { putData, getData } = useDataCall();
  const { doctors } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const [symptoms, setSymptoms] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Get doctor's fee using doctorId
  const doctor = doctors?.data?.find(doc => doc.id === doctorId);
  const doctorFee = doctor?.fee || 0;

  const handleAppointmentGet = async () => {
    if (!appoId) {
      toast.error("Appointment ID is missing!");
      return;
    }

    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    // Show payment modal first
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    const paymentData = {
      status: "confirmed",
      paymentMethod: "vodafone_cash",
      paymentStatus: "pending",
      symptoms: symptoms,
      isReadPat: true,
      isReadDr: false
    };
    
    try {
      const res = await putData("appointments", appoId, paymentData);
      
      if (res.status === 200 || res.status === 202) {
        setShowPaymentModal(false);
        setShowModal(false);
        setSymptoms("");
        
        // Update all necessary data
        dispatch(getDataSuccess({ data: res.data }));
        
        // Refresh appointments list
        await getData("appointments");
        
        toast.success("Appointment confirmed! Please transfer the payment to the doctor's Vodafone Cash number.");
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to submit appointment. Please try again.");
    }
  };
  
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Book Appointment</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Doctor's Name:{" "}
                    <span className="font-bold">{doctorName}</span>
                  </p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Date: <span className="font-bold">{date}</span>
                  </p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Time: <span className="font-bold">{time}</span>
                  </p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Address: <span className="font-bold">{address}</span>
                  </p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Fee: <span className="font-bold">${doctorFee}</span>
                  </p>
                  <hr />
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Patient's Name:{" "}
                    <span className="font-bold">{patientName}</span>
                  </p>
                  <hr />
                  <div className="border-2 flex justify-start pl-3 items-center mt-3 rounded-lg text-lg">
                    <label htmlFor="symptomeInput">Symptoms: </label>
                    <input
                      id="symptomeInput"
                      className="outline-none my-4 ml-2 text-blueGray-500 text-lg leading-relaxed w-full"
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Please describe your symptoms"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-main-dark-blue background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-main-dark-blue text-white active:text-main-light-blue2 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleAppointmentGet}
                  >
                    CONFIRM APPOINTMENT
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {/* Payment Modal */}
      {showPaymentModal ? (
        <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Payment Instructions</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowPaymentModal(false)}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Please transfer the payment amount of <span className="font-bold">${doctorFee}</span> to the doctor's Vodafone Cash number.
                </p>
                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    After transferring the payment, click the "Confirm Payment" button below.
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-main-dark-blue background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-main-dark-blue text-white active:text-main-light-blue2 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handlePayment}
                  >
                    CONFIRM PAYMENT
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <ToastContainer />
    </>
  );
}