import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaMap } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Hospitals = () => {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            fetchNearbyHospitals(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            setError('Unable to get your location. Please enable location services.');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
      }
    };
    getUserLocation();
  }, []);

  const fetchNearbyHospitals = async (lat, lng) => {
    try {
      const radius = 5000; // 5km radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });
      const data = await response.json();
      const hospitalList = data.elements.map(hospital => ({
        id: hospital.id,
        name: hospital.tags.name || 'Unnamed Hospital',
        lat: hospital.lat,
        lng: hospital.lon,
        address: hospital.tags['addr:street'] || 'Address not available',
        phone: hospital.tags.phone || 'Phone not available',
        openingHours: hospital.tags.opening_hours || 'Hours not available',
      }));
      setHospitals(hospitalList);
      setLoading(false);
    } catch (error) {
      setError('Error fetching nearby hospitals');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('Try Again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Nearby Hospitals (Test Heading)</h1>
      <div className="space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Hospitals List</h2>
        {hospitals.length === 0 ? (
          <p className="text-gray-500">No hospitals found nearby</p>
        ) : (
          hospitals.map(hospital => (
            <div
              key={hospital.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-bold text-lg mb-2">{hospital.name}</h3>
                <div className="space-y-1 text-gray-600 text-sm">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {hospital.address}
                  </p>
                  <p className="flex items-center">
                    <FaPhone className="mr-2" />
                    {hospital.phone}
                  </p>
                  <p className="flex items-center">
                    <FaClock className="mr-2" />
                    {hospital.openingHours}
                  </p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 md:ml-6 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                title={t('Go to location')}
              >
                <FaMap className="mr-2" /> Go to location
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Hospitals; 