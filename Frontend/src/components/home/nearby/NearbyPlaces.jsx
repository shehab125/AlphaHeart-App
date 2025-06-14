import React from 'react';
import { Link } from 'react-router-dom';
import { FaPills, FaHospital } from 'react-icons/fa';

const NearbyPlaces = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-12">
      <Link
        to="/patient/pharmacies"
        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl flex items-center hover:bg-blue-700 transition-colors shadow"
      >
        <FaPills className="mr-3 text-2xl" />
        Nearby Pharmacies
      </Link>
      <Link
        to="/patient/hospitals"
        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl flex items-center hover:bg-blue-700 transition-colors shadow"
      >
        <FaHospital className="mr-3 text-2xl" />
        Nearby Hospitals
      </Link>
    </div>
  );
};

export default NearbyPlaces; 