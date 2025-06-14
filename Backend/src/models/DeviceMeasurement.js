const mongoose = require('mongoose');

const deviceMeasurementSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  deviceSerial: {
    type: String,
    required: true
  },
  measurements: {
    bodyTemp: {
      type: Number,
      required: true
    },
    ambientTemp: {
      type: Number,
      required: true
    },
    heartRate: {
      type: Number,
      required: true
    },
    oxygen: {
      type: Number,
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeviceMeasurement', deviceMeasurementSchema); 