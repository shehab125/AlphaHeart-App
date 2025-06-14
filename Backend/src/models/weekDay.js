"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { dayNames } = require('../configs/constraints')
// WeekDay Model:

const weekDaySchema = new Schema(
    {
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true,
        },
        startHour: {
            type: String,
            required: true,
        },
        finishHour: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        lunchStart: {
            type: String,
        },
        lunchFinish: {
            type: String,
        },
        appointmentDuration: {
            type: Number, // Duration in minutes
            required: true,
            default: 30,
        },
        startingDate: {
            type: Date,
            required: true,
        },
        endingDate: {
            type: Date,
            required: true,
        },
        isHoliday: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Add index for efficient querying
weekDaySchema.index({ doctorId: 1, name: 1 });

// FOR REACT PROJECT:
weekDaySchema.pre('init', function (data) {
    data.id = data._id
    data.createds = data.createdAt.toLocaleDateString('de-de')
})
/* ------------------------------------------------------- */
const WeekDay = mongoose.model("WeekDay", weekDaySchema);
module.exports = WeekDay;