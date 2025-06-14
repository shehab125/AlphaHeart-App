import React from 'react';
import { FaUserMd, FaCalendarAlt, FaVideo, FaFileMedical } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaUserMd className="w-12 h-12 text-blue-600" />,
      title: "Find Top Doctors",
      description: "Access a network of qualified and experienced healthcare professionals across various specialties."
    },
    {
      icon: <FaCalendarAlt className="w-12 h-12 text-green-600" />,
      title: "Easy Appointment Booking",
      description: "Book, reschedule, or cancel appointments with just a few clicks, 24/7."
    },
    {
      icon: <FaVideo className="w-12 h-12 text-purple-600" />,
      title: "Virtual Consultations",
      description: "Connect with doctors through secure video consultations from the comfort of your home."
    },
    {
      icon: <FaFileMedical className="w-12 h-12 text-red-600" />,
      title: "Digital Health Records",
      description: "Keep track of your medical history, prescriptions, and test results in one secure place."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Comprehensive healthcare solutions at your fingertips
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gray-50 rounded-full mb-4 group-hover:bg-blue-50 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
