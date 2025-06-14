const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    specialization: {
      type: String,
    },
    experience: {
      type: Number,
    },
    education: {
      type: String,
    },
    insuranceType: {
      type: String,
      enum: ["Private", "Compulsory"],
    },
    appointmentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    appointmentPricePrivate: {
      type: Number,
      default: 0,
      min: 0,
    },
    appointmentPriceCompulsory: {
      type: Number,
      default: 0,
      min: 0,
    },
    profileImage: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User; 