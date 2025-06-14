import React, { useState } from "react";
import { useSelector } from "react-redux";
import useDataCall from "../../../../hooks/useDataCall";

const DNotificationCard = ({ id, isReadDr, patientId, date, isCancelledPat, timeStart, complaints}) => {
  const [isOpened, setIsOpened] = useState(false);
  const { putData } = useDataCall();

  const handleNotificationRead = () => {
    setIsOpened(true);
    putData("appointments", id, {
      isReadDr: true,
    });
  };

  const { patients } = useSelector((state) => state.data);

  const patient = patients?.filter((pat) => {
    return pat.id === patientId;
  });
console.log("patpat:", patient);
  return (
    <div className="relative px-6 py-3 flex-auto ">
      {isOpened === false ? (
        <div className={` ${!isCancelledPat ? "bg-sky-200" : "bg-red-200"} dark:bg-main-dark-blue py-6 px-3 rounded-lg flex justify-between`}>
          <p className="dark:text-white">{ !isCancelledPat ? "You have an appointment tomorrow." : "Your appointment has been cancelled by the patient."}</p>
          <button
            className="font-bold uppercase text-sm rounded hover:cursor-pointer hover:scale-[1.1] outline-none focus:outline-none ease-linear transition-all duration-150 dark:text-main-light-blue"
            type="button"
            onClick={()=>setIsOpened(true)}
          >
            DETAIL
          </button>
          {isReadDr === false && (
            <div className="absolute h-5 w-5 rounded-full bg-green-600 left-[27.5rem] top-[0.5rem]"></div>
          )}
        </div>
      ) : (
        <div className={`${!isCancelledPat ? "bg-sky-100" : "bg-red-100"} dark:bg-sky-600 dark:text-main-light-blue p-2 rounded-lg`}>
          <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
            Patient Name:{" "}
            <span className="font-bold">
              {
                patient[0]?.firstName +
                " " +
                patient[0]?.lastName}
            </span>
          </p>
          <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
          Symptoms: <span className="font-bold">{complaints}</span>
          </p>
          <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
            Date: <span className="font-bold">{date}</span>
          </p>
          <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
            Time: <span className="font-bold">{timeStart}</span>
          </p>
          <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
            Address:{" "}
            <span className="font-bold">
              {patient[0]?.street +
                " " +
                patient[0]?.zipCode +
                " " +
                (patient[0]?.cityId?.name || patient[0]?.cityName || patient[0]?.zipCode % 2=== 0 ? "Berlin" : "Cologne")}
            </span>
          </p>
          <hr />

          <p className="my-4 text-blueGray-500">
         
          { !isCancelledPat ? "You can view, check and edit your appointments on the 'Calendar' and 'Overview' pages." : "Unfortunately, your appointment has been cancelled by the patient."}
          </p>
          <hr />
          <button
            className="bg-emerald-500 text-white mt-3 active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={handleNotificationRead}
          >
            OKAY
          </button>
        </div>
      )}
    </div>
  );
};

export default DNotificationCard;