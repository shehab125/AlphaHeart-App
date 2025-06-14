import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const URL = process.env.REACT_APP_BASE_URL;

const DeviceMeasurementsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [measurements, setMeasurements] = useState({
    bodyTemp: 0,
    ambientTemp: 0,
    heartRate: 0,
    lastUpdated: new Date().toLocaleString(),
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user.device?.serial) {
          setError("No device connected");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${URL}/api/device/measurements/${user._id}`);
        const data = response.data;

        if (data && data.measurements) {
          setMeasurements({
            bodyTemp: data.measurements.bodyTemp,
            ambientTemp: data.measurements.ambientTemp,
            heartRate: data.measurements.heartRate,
            lastUpdated: new Date(data.timestamp).toLocaleString(),
          });
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching device data:", err);
        setError("Failed to fetch device data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [user._id, user.device?.serial]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>Loading device data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 24, color: 'red' }}>Device Error</h2>
        <p>{error}</p>
        {!user.device?.isLinked && (
          <p style={{ marginTop: 16 }}>
            Please contact your administrator to link a device to your account.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Device Measurements</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#666' }}>Body Temperature</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            {measurements.bodyTemp.toFixed(1)} °C
          </p>
        </div>
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#666' }}>Ambient Temperature</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            {measurements.ambientTemp.toFixed(1)} °C
          </p>
        </div>
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#666' }}>Heart Rate</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            {measurements.heartRate.toFixed(0)} bpm
          </p>
        </div>
      </div>
      <p style={{ color: '#888', marginTop: 24 }}>
        Last Updated: {measurements.lastUpdated}
      </p>
    </div>
  );
};

export default DeviceMeasurementsPage; 