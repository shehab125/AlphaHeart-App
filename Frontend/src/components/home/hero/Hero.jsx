import React, { useRef } from 'react';
import foto from "../../../assets/doctor-patient.png";
import locationIcon from "../../../assets/locationIcon.png";
import { useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';

const Hero = () => {
  const navigate = useNavigate();
  const searchParamsRef = useRef({ name: "", branch: "", city: "", zipCodes: "" });

  const handleInputChange = (field, value) => {
    searchParamsRef.current = {
      ...searchParamsRef.current,
      [field]: value,
    };
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate("/search", { state: searchParamsRef.current });
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-blue-700 via-blue-400 to-green-200 overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 gap-10">
        {/* Left: Text & Search */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow mb-6 animate-fade-in">
            Book Your Medical Appointment <span className="bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent animate-gradient">Easily & Safely</span>
              </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl animate-fade-in delay-100">
            AlphaHeart helps you find the best doctors, book appointments online, and manage your health all in one place.
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-lg flex flex-col sm:flex-row items-center gap-3 animate-fade-in delay-200">
            <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full">
              <FaSearch className="text-blue-500 mr-2" />
                    <input
                      type="text"
                className="flex-1 outline-none bg-transparent text-blue-900 placeholder-blue-400 text-base"
                placeholder="Doctor name or specialty"
                      onChange={(e) => handleInputChange('name', (e.target.value).toLowerCase())}
                    />
                  </div>
            <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full">
              <img src={locationIcon} alt="locationIcon" className="w-5 h-5 mr-2" />
                    <input
                      type="text"
                className="flex-1 outline-none bg-transparent text-blue-900 placeholder-blue-400 text-base"
                placeholder="City or ZIP code"
                      onChange={(e) => handleInputChange('city', (e.target.value).toLowerCase())}
                    />
                  </div>
                    <button
                      type="submit"
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg text-lg transition w-full sm:w-auto"
                    >
              <FaSearch className="mr-2" /> Search
                    </button>
              </form>
            </div>
        {/* Right: Image */}
        <div className="flex-1 flex justify-center items-center animate-fade-in delay-300">
            <img
            alt="Doctor and Patient"
            className="object-cover w-full max-w-md rounded-3xl shadow-2xl border-4 border-white"
              src={foto}
            />
          </div>
        </div>
      </section>
  );
};

export default Hero;