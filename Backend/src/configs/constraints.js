'use strict'

module.exports = {
  userTypes: ["admin", "doctor", "patient"],
  genders: ["Male", "Female", "Others"],
  insurance: ["Private", "Compulsory"],
  dayNames: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  notificationTypes: [
    "incomingAppointment",
    "byDoctorCancelledAppointment",
    "byPatientCancelledAppointment",
    "tomorrowAppoNumber",
  ],
};