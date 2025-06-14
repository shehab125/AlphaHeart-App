const Appointment = require('../models/appointment');
const User = require('../models/user');

module.exports = {
    // Get appointment price
    getAppointmentPrice: async (req, res) => {
        try {
            const { doctorId, insuranceType } = req.body;
            
            const doctor = await User.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found"
                });
            }

            let price = 0;
            if (insuranceType === "Private") {
                price = doctor.appointmentPricePrivate || doctor.appointmentPrice;
            } else {
                price = doctor.appointmentPriceCompulsory || doctor.appointmentPrice;
            }

            res.status(200).json({
                success: true,
                price
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error getting appointment price",
                error: error.message
            });
        }
    },

    // Process payment
    processPayment: async (req, res) => {
        try {
            const { appointmentId, paymentId } = req.body;

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found"
                });
            }

            // Update appointment with payment information
            appointment.paymentStatus = "paid";
            appointment.paymentId = paymentId;
            appointment.paymentDate = new Date();
            await appointment.save();

            res.status(200).json({
                success: true,
                message: "Payment processed successfully",
                appointment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error processing payment",
                error: error.message
            });
        }
    },

    // Update doctor's appointment prices
    updateDoctorPrices: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const { appointmentPrice, appointmentPricePrivate, appointmentPriceCompulsory } = req.body;

            const doctor = await User.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found"
                });
            }

            if (appointmentPrice) doctor.appointmentPrice = appointmentPrice;
            if (appointmentPricePrivate) doctor.appointmentPricePrivate = appointmentPricePrivate;
            if (appointmentPriceCompulsory) doctor.appointmentPriceCompulsory = appointmentPriceCompulsory;

            await doctor.save();

            res.status(200).json({
                success: true,
                message: "Doctor prices updated successfully",
                doctor
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error updating doctor prices",
                error: error.message
            });
        }
    }
}; 