import React from "react";
import aboutImage from "../../assets/about-img.png";
import "./about.css";

const About = () => {
  return (
    <div className='bg-[#F1F7FE] border-y-8 border-main-light-blue2 border-opacity-40 pt-24 pb-20'>
      <h1 className="text-main-dark-blue text-3xl font-semibold text-center pt-10 pb-10">About Us</h1>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-main-light-blue2">
                <h2 className="text-xl font-bold text-main-dark-blue mb-3">Online Appointment Booking</h2>
                <p className="text-main-dark-blue">
                  Our online appointment scheduling tool offers a user-friendly interface for quick and easy appointment planning for both patients and doctors.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-main-light-blue2">
                <h2 className="text-xl font-bold text-main-dark-blue mb-3">Doctor Registration & Profile Management</h2>
                <p className="text-main-dark-blue">
                  Doctors have the opportunity to create and update their profiles, where they can specify their specialties and working hours.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-main-light-blue2">
                <h2 className="text-xl font-bold text-main-dark-blue mb-3">Patient Registration & Profile Management</h2>
                <p className="text-main-dark-blue">
                  We offer services for creating and updating patient records, where health history and personal information are securely stored in the patient profile.
                </p>
        </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-main-light-blue2">
                <h2 className="text-xl font-bold text-main-dark-blue mb-3">Doctor-Patient Communication</h2>
                <p className="text-main-dark-blue">
                  Our platform enables effective communication between doctor and patient through various options such as message exchange or video calls. Questions can be clarified both before and after the appointment.
                </p>
        </div>
      </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-main-light-blue2">
                <h2 className="text-xl font-bold text-main-dark-blue mb-3">Notification and Reminder Service</h2>
                <p className="text-main-dark-blue">
                  With our service, you receive reminder messages on the day of the appointment as well as immediate notifications about appointment changes or cancellations.
                </p>
                  </div>
                
              <div className="bg-white p-6 rounded-lg shadow-md border border-main-light-blue2">
                <h2 className="text-xl font-bold text-main-dark-blue mb-3">Doctor Ratings and Comments</h2>
                <p className="text-main-dark-blue">
                  Patients have the opportunity to rate their doctors and leave comments. They can also view feedback from other patients.
                </p>
                </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-main-light-blue2">
                <h2 className="text-xl font-bold text-main-dark-blue mb-3">Data Security and Privacy</h2>
                <p className="text-main-dark-blue">
                  The security and confidentiality of your patient data is our highest priority. We apply encryption and protection protocols for all data transfers.
                  </p>
                </div>

              <div className="flex justify-center">
                <img src={aboutImage} alt="About Us" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
  );
};

export default About;
