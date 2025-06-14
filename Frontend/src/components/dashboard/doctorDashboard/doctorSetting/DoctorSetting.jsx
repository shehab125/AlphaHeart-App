import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useDataCall from '../../../../hooks/useDataCall';
import ManageAppo from '../manageAppointments/ManageAppo';

const DoctorSetting = () => {
  const { userId } = useSelector((state) => state.auth);
  const { getSingleData, putData } = useDataCall();
  const [prices, setPrices] = useState({
    appointmentPrice: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const response = await getSingleData("doctors", userId);
        console.log('Doctor data:', response);
        if (response?.data) {
          setPrices({
            appointmentPrice: response.data.appointmentPrice || '',
          });
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setMessage("Error loading doctor data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [userId]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPrices(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating prices:', prices);
      const response = await putData("doctors", userId, prices);
      console.log('Update response:', response);
      setMessage("Prices updated successfully!");
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating prices:', error);
      setMessage("Error updating prices. Please try again.");
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-dark-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="doctor-setting-modern doctor-setting-container p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-main-dark-blue mb-4">Appointment Prices</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Appointment Price (€)</label>
            <input
              type="number"
              name="appointmentPrice"
              value={prices.appointmentPrice}
              onChange={handlePriceChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-dark-blue"
              min="0"
              step="0.01"
              placeholder="Enter appointment price"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-main-dark-blue text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Update Price
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
      <ManageAppo />
      </div>
    </div>
  );
};

export default DoctorSetting; 