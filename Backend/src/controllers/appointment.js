"use strict"

// Appointment Controller:

const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const WeekDay = require("../models/weekDay");
const { sendEmail } = require("../utils/email");
const { validateAppointmentTime, validateAppointmentDate } = require("../utils/validators");
const User = require("../models/user"); // Import User model

// Helper: توليد أوقات المواعيد
function generateTimeSlots(start, end, duration) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  let [eh, em] = end.split(":").map(Number);
  let startMinutes = h * 60 + m;
  let endMinutes = eh * 60 + em;
  while (startMinutes + duration <= endMinutes) {
    let sh = String(Math.floor(startMinutes / 60)).padStart(2, "0");
    let sm = String(startMinutes % 60).padStart(2, "0");
    slots.push(`${sh}:${sm}`);
    startMinutes += duration;
  }
  return slots;
}

module.exports = {
  // جلب أو توليد مواعيد اليوم
  getOrCreateDayAppointments: async (req, res) => {
    const { doctorId, date } = req.body;
    try {
      // ابحث عن المواعيد الموجودة
      const appointmentDate = new Date(date);
      appointmentDate.setHours(0, 0, 0, 0);

      let appointments = await Appointment.find({
        doctorId,
        date: {
          $gte: appointmentDate,
          $lt: new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      if (appointments.length > 0) {
        return res.json({ success: true, data: appointments });
      }

      // ابحث عن جدول عمل الطبيب
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found." });
      }

      // تأكد من وجود رسوم الطبيب
      const doctorFee = doctor.appointmentPrice || 150; // Changed from doctor.fee

      // ابحث عن اليوم في جدول العمل
      const selectedDate = new Date(date);
      const normalizeDate = (d) => {
        const nd = new Date(d);
        nd.setHours(0, 0, 0, 0);
        return nd.getTime();
      };
      const workingDay = doctor.workingSchedule.find((schedule) => {
        return normalizeDate(schedule.date) === normalizeDate(selectedDate);
      });
      if (!workingDay) {
        return res.status(404).json({ success: false, message: "No working hours for this day." });
      }

      // توليد الأوقات
      const slots = generateTimeSlots(workingDay.startTime, workingDay.endTime, 30);

      // إنشاء المواعيد
      const newAppointments = await Appointment.insertMany(
        slots.map((timeStart) => {
          const [h, m] = timeStart.split(":").map(Number);
          const duration = 30;
          const endMinutes = h * 60 + m + duration;
          const endHour = String(Math.floor(endMinutes / 60)).padStart(2, "0");
          const endMinute = String(endMinutes % 60).padStart(2, "0");
          const timeEnd = `${endHour}:${endMinute}`;

          const price = doctorFee;
          const platformCommission = price * 0.1;
          const patientFee = price + platformCommission;
          const doctorReceives = price - platformCommission;

          return {
            doctorId,
            date: appointmentDate,
            timeStart,
            timeEnd,
            insuranceType: "Private",
            status: "pending",
            price,
            patientFee,
            doctorReceives,
            platformCommission,
            isReadPat: true,
            isReadDr: false,
          };
        })
      );

      const populatedAppointments = await Appointment.find({ _id: { $in: newAppointments.map((app) => app._id) } });
      return res.json({ success: true, data: populatedAppointments });
    } catch (err) {
      console.error("Error in getOrCreateDayAppointments:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  list: async (req, res) => {
    /*
            #swagger.tags = ["Appointments"]
            #swagger.summary = "List Appointments"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    try {
      const { date, doctorId } = req.query;
      let query = {};

      if (date) {
        // Convert date string to Date object and set time to start of day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        // Set end date to end of day
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        query.date = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      if (doctorId) {
        query.doctorId = doctorId;
      }

      const data = await Appointment.find(query)
        .populate("doctorId", "firstName lastName title")
        .populate("patientId", "firstName lastName email");

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error("Error listing appointments:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching appointments",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Appointments"]
            #swagger.summary = "Create Appointment"
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: { $ref: "#/definitions/Appointment" }
            }
        */

    try {
      let { doctorId, price, date, timeStart, timeEnd, patientId } = req.body;
      console.log("REQ BODY:", req.body);

      // Check if appointment already exists
      const existingAppointment = await Appointment.findOne({
        doctorId,
        date,
        timeStart,
        timeEnd,
        status: { $in: ["pending", "confirmed"] },
      });

      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: "هذا الموعد محجوز بالفعل",
        });
      }

      // Convert date string to Date object
      if (date) {
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0);
        req.body.date = appointmentDate;
      }

      if (!price || price === 0) {
        const doctor = await User.findById(doctorId); // Use User model for doctor
        console.log("DOCTOR:", doctor);
        price = doctor?.appointmentPrice || 150; // Use appointmentPrice
        req.body.price = price;
        console.log("USING DOCTOR FEE:", price);
      }

      // Set default status and payment status
      req.body.status = "pending";
      req.body.paymentStatus = "pending";
      req.body.isReadPat = true;
      req.body.isReadDr = false;

      // Try to find an existing empty slot for this time
      const emptySlot = await Appointment.findOne({
        doctorId,
        date: req.body.date,
        timeStart,
        timeEnd,
        patientId: null
      });

      let data, populatedData;
      if (emptySlot) {
        // Update the empty slot with patient info
        Object.assign(emptySlot, req.body);
        await emptySlot.save();
        data = emptySlot;
        populatedData = await Appointment.findById(data._id)
          .populate("doctorId", "firstName lastName title email")
          .populate("patientId", "firstName lastName email");
      } else {
        // No empty slot, create new appointment as fallback
        data = await Appointment.create(req.body);
        populatedData = await Appointment.findById(data._id)
        .populate("doctorId", "firstName lastName title email")
        .populate("patientId", "firstName lastName email");
      }

      // Send email notification to doctor
      if (populatedData.doctorId?.email) {
        try {
          await sendEmail({
            email: populatedData.doctorId.email,
            subject: "New Appointment Request",
            message: `
                            <h2>New Appointment Request</h2>
                            <p>Patient: ${populatedData.patientId?.firstName} ${populatedData.patientId?.lastName}</p>
                            <p>Date: ${populatedData.date}</p>
                            <p>Time: ${populatedData.timeStart}</p>
                            <p>Status: ${populatedData.status}</p>
                        `,
          });
        } catch (emailError) {
          console.error("Error sending email to doctor:", emailError);
        }
      }

      res.status(201).json({
        success: true,
        data: populatedData,
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({
        success: false,
        message: "Error creating appointment",
        error: error.message,
      });
    }
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Appointments"]
            #swagger.summary = "Get Single Appointment"
        */
    const data = await Appointment.find({
      $or: [{ patientId: req.params.id }, { doctorId: req.params.id }],
    });

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    try {
      console.log("Update request body:", req.body);
      console.log("Update request params:", req.params);

      const data0 = await Appointment.findOne({ _id: req.params.id }).populate(["doctorId", "patientId"]);

      if (!data0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      // Handle payment data
      if (req.body.paymentMethod) {
        req.body.paymentStatus = "pending";
        req.body.status = "confirmed";
        req.body.isReadPat = true;
        req.body.isReadDr = false;

        // Validate payment data
        if (!req.body.paymentMethod) {
          return res.status(400).json({
            success: false,
            message: "Payment method is required",
          });
        }
      }

      const data = await Appointment.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      ).populate(["doctorId", "patientId"]);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      if (req.body.patientId) {
        await Patient.updateOne({ _id: data.patientId }, { $push: { appointments: data.id } });
      } else if (req.body.isCancelled === false) {
        await Patient.updateOne({ _id: data0.patientId }, { $pull: { appointments: data0.id } });
      }

      // Send email notification
      if (data.patientId && data.doctorId) {
        try {
          await sendEmail({
            email: data.patientId.email,
            subject: "Appointment Confirmed",
            message: `
                            <h2>Doctor:</h2> <p>${data.doctorId.title}. ${data.doctorId.firstName} ${data.doctorId.lastName}</p>
                            <h2>Time:</h2> <p>${data.date} - ${data.timeStart}</p>
                            <h2>Address:</h2> <p>${data.doctorId.street}, ${data.doctorId.zipCode}</p>
                            <h2>Status:</h2> <p>${data.status}</p>
                            <h2>Payment Status:</h2> <p>${data.paymentStatus}</p>
                            <hr/>
                            <h2>Notification:</h2> <p>Your appointment has been confirmed. Please transfer the payment to the doctor\'s Vodafone Cash number.</p>
                        `,
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
      }

      res.status(202).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({
        success: false,
        message: "Error updating appointment",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Appointments"]
            #swagger.summary = "Delete Appointment"
        */

    const data = await Appointment.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },

  // Removed createAppointment function as it's not used and duplicates functionality
};


