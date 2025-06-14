const express = require('express');
const router = express.Router();
const DeviceMeasurement = require('../models/DeviceMeasurement');
const Patient = require('../models/patient');

// Middleware to verify device authentication
const verifyDevice = async (req, res, next) => {
  const { deviceId } = req.body;
  try {
    const patient = await Patient.findOne({ 'device.serial': deviceId });
    if (!patient) {
      return res.status(401).json({ message: 'Invalid device ID' });
    }
    req.patient = patient;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying device' });
  }
};

// Endpoint for ESP32 to send measurements
router.post('/measurements', verifyDevice, async (req, res) => {
  try {
    const { heartRate, temperature1, temperature2 } = req.body;
    const newMeasurement = new DeviceMeasurement({
      patientId: req.patient._id,
      deviceSerial: req.body.deviceId,
      measurements: {
        bodyTemp: temperature1,
        ambientTemp: temperature2,
        heartRate: heartRate,
        oxygen: 98 // Default value as ESP32 doesn't have oxygen sensor
      }
    });
    await newMeasurement.save();
    res.status(201).json({ message: 'Measurements saved successfully' });
  } catch (error) {
    console.error('Error saving measurements:', error);
    res.status(500).json({ message: 'Error saving measurements' });
  }
});

// Endpoint to get latest measurements for a patient
router.get('/measurements/:patientId', async (req, res) => {
  try {
    const measurements = await DeviceMeasurement
      .find({ patientId: req.params.patientId })
      .sort({ timestamp: -1 })
      .limit(1);
    res.json(measurements[0] || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching measurements' });
  }
});

module.exports = router; 