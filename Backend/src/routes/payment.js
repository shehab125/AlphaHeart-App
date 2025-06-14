const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { isAdmin, isDoctor } = require('../middlewares/permissions');

// Get appointment price
router.post('/price', paymentController.getAppointmentPrice);

// Process payment
router.post('/process', paymentController.processPayment);

// Update doctor's prices (admin or doctor only)
router.put('/doctor/:doctorId', isAdmin, paymentController.updateDoctorPrices);

module.exports = router; 