"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeStart: {
      type: String,
      required: true,
    },
    timeEnd: {
      type: String,
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    patientName: {
      type: String,
    },
    complaints: {
      type: String,
    },
    insuranceType: {
      type: String,
      enum: ["Private", "Compulsory"],
      required: true,
    },
    files: [
      {
        type: String,
      },
    ],
    doctorOpinion: {
      type: String,
    },
    isReadPat: {
      type: Boolean,
      default: false,
    },
    isReadDr: {
      type: Boolean,
      default: false,
    },
    isCancelledPat: {
      type: Boolean,
      default: false,
    },
    isCancelledDr: {
      type: Boolean,
      default: false,
    },
    cancelUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cancelUserType: {
      type: String,
      enum: ["doctor", "patient"],
    },
    cancelDate: {
      type: Date,
    },
    cancelReason: {
      type: String,
    },
    weekDay: {
      type: Schema.Types.ObjectId,
      ref: "WeekDay",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    rescheduledFrom: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    notes: {
      type: String,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      default: 30,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    patientFee: {
      type: Number, // What the patient pays (price + 10%)
      default: 0,
    },
    doctorReceives: {
      type: Number, // What the doctor receives (price - 10%)
      default: 0,
    },
    platformCommission: {
      type: Number, // Platform commission (10% of price)
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
appointmentSchema.index({ doctorId: 1, date: 1, timeStart: 1 });
appointmentSchema.index({ patientId: 1, date: 1 });

// Add method to check for time conflicts
appointmentSchema.methods.hasTimeConflict = async function() {
  const Appointment = mongoose.model("Appointment");
  const existingAppointment = await Appointment.findOne({
    doctorId: this.doctorId,
    date: this.date,
    $or: [
      {
        $and: [
          { timeStart: { $lte: this.timeStart } },
          { timeEnd: { $gt: this.timeStart } },
        ],
      },
      {
        $and: [
          { timeStart: { $lt: this.timeEnd } },
          { timeEnd: { $gte: this.timeEnd } },
        ],
      },
    ],
    _id: { $ne: this._id },
  });
  return !!existingAppointment;
};

// Add method to check if appointment is in the past
appointmentSchema.methods.isPast = function() {
  const now = new Date();
  const appointmentDate = new Date(this.date);
  appointmentDate.setHours(parseInt(this.timeStart.split(":")[0]));
  appointmentDate.setMinutes(parseInt(this.timeStart.split(":")[1]));
  return appointmentDate < now;
};

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;