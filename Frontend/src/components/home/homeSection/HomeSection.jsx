import React from "react";
import logo_cal from "../../../assets/calendar.png";
import happy from "../../../assets/happy.png";
import security from "../../../assets/security.png";
import "./HomeSection.css";
const HomeSection = () => {
  return (
    <div className="bg-main-dark-blue w-full min-h-[350px] mt-[-40px]">
      <h1 className="text-main-light-blue text-[40px] text-center 2xl:text-left 2xl:ml-32 p-5">
        Why you should{" "}
        <span className="text-main-light-blue2 font-medium">choose us?</span>
      </h1>
      <div className="flex flex-row justify-center items-center h-full flex-wrap ">
        <div className="w-[400px] sm:w-[500px] h-[220px] p-3">
          <div className=" flex gap-4 justify-center w-[350px] sm:w-[400px]">
            <img src={logo_cal} alt="" />
            <h2 className="text-2xl mt-2 font-bold text-main-light-blue ">
              Simple Appointment System
            </h2>
          </div>
          <p className="text-white sm:px-10 w-[370px] sm:w-[470px] mt-5">
            Our online appointment system enables patients and doctors
            to get in touch more quickly and easily. Through
            a simple appointment system, we facilitate an efficient
            connection between patients and doctors.
          </p>
        </div>
        <div className=" w-[400px] sm:w-[500px] h-[220px] p-3">
          <div className=" flex gap-4 justify-center w-[350px] sm:w-[400px]">
            <img src={happy} alt="" />
            <h2 className="text-2xl mt-2 font-bold text-main-light-blue ">
            Customer Satisfaction
            </h2>
          </div>
          <p className="text-white sm:px-10 w-[370px] sm:w-[470px] mt-2">
              We focus on high quality and customer satisfaction.
              We continuously develop and place great emphasis on the
              user experience to provide first-class healthcare services.
          </p>
        </div>
        <div className="w-[400px] sm:w-[500px] h-[220px] p-3">
          <div className=" flex gap-4 justify-center w-[350px] sm:w-[400px]">
            <img src={security} alt="" />
            <h2 className="text-2xl mt-2 font-bold text-main-light-blue ">
            Security
            </h2>
          </div>
          <p className="text-white sm:px-10 w-[370px] sm:w-[470px] mt-3">
            Your personal information is stored securely, and we
            consistently implement modern security standards. You can
            be sure that your health is in good hands.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;