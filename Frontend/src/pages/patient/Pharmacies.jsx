import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaMap } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Pharmacies = () => {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState({ lat: '', lng: '' });
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            fetchNearbyPharmacies(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            setShowManualInput(true);
            setLoading(false);
          }
        );
      } else {
        setShowManualInput(true);
        setLoading(false);
      }
    };
    getUserLocation();
  }, []);

  const fetchNearbyPharmacies = async (lat, lng) => {
    try {
      setLoading(true);
      const radius = 5000; // 5km radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="pharmacy"](around:${radius},${lat},${lng});
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
      const pharmacyList = data.elements.map(pharmacy => ({
        id: pharmacy.id,
        name: pharmacy.tags.name || 'Unnamed Pharmacy',
        lat: pharmacy.lat,
        lng: pharmacy.lon,
        address: pharmacy.tags['addr:street'] || 'Address not available',
        phone: pharmacy.tags.phone || 'Phone not available',
        openingHours: pharmacy.tags.opening_hours || 'Hours not available',
      }));
      setPharmacies(pharmacyList);
      setLoading(false);
    } catch (error) {
      setError('Error fetching nearby pharmacies');
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualLocation.lat && manualLocation.lng) {
      setUserLocation({ lat: parseFloat(manualLocation.lat), lng: parseFloat(manualLocation.lng) });
      fetchNearbyPharmacies(manualLocation.lat, manualLocation.lng);
      setShowManualInput(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Nearby Pharmacies</h1>
      {userLocation && (
        <div className="mb-4 text-center text-blue-800 font-semibold flex flex-col items-center gap-2">
          <span>Your location: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}</span>
          <button
            className="bg-gray-200 text-blue-700 px-4 py-1 rounded hover:bg-gray-300 text-sm font-normal"
            onClick={() => setShowManualInput(true)}
          >
            Set location manually
          </button>
        </div>
      )}
      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="max-w-md mx-auto mb-6 bg-white p-4 rounded shadow">
          <div className="mb-2 font-semibold text-center">Enter your location manually:</div>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={manualLocation.lat}
              onChange={e => setManualLocation({ ...manualLocation, lat: e.target.value })}
              className="border px-2 py-1 rounded w-1/2"
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={manualLocation.lng}
              onChange={e => setManualLocation({ ...manualLocation, lng: e.target.value })}
              className="border px-2 py-1 rounded w-1/2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Show Pharmacies</button>
        </form>
      )}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Pharmacies List</h2>
          {pharmacies.length === 0 ? (
            <p className="text-gray-500">No pharmacies found nearby</p>
          ) : (
            pharmacies.map(pharmacy => {
              let distance = userLocation ? haversineDistance(userLocation.lat, userLocation.lng, pharmacy.lat, pharmacy.lng) : null;
              return (
                <div
                  key={pharmacy.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg mb-2">{pharmacy.name}</h3>
                    <div className="space-y-1 text-gray-600 text-sm">
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        {pharmacy.address}
                      </p>
                      <p className="flex items-center">
                        <FaPhone className="mr-2" />
                        {pharmacy.phone}
                      </p>
                      <p className="flex items-center">
                        <FaClock className="mr-2" />
                        {pharmacy.openingHours}
                      </p>
                      {distance !== null && (
                        <p className="flex items-center text-blue-700 font-semibold">
                          Distance: {distance.toFixed(2)} km
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 md:mt-0 md:ml-6 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    title={t('Go to location')}
                  >
                    <FaMap className="mr-2" /> Go to location
                  </a>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Pharmacies; 