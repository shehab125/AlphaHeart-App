// Validate appointment time format and logic
exports.validateAppointmentTime = (timeStart, timeEnd) => {
  // Check if time format is valid (HH:mm)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeStart) || !timeRegex.test(timeEnd)) {
    return false;
  }

  // Convert times to minutes for easier comparison
  const [startHours, startMinutes] = timeStart.split(":").map(Number);
  const [endHours, endMinutes] = timeEnd.split(":").map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Check if end time is after start time
  if (endTotalMinutes <= startTotalMinutes) {
    return false;
  }

  // Check if appointment duration is reasonable (e.g., not more than 4 hours)
  const duration = endTotalMinutes - startTotalMinutes;
  if (duration > 240) {
    return false;
  }

  return true;
};

// Validate appointment date
exports.validateAppointmentDate = (date) => {
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if date is in the past
  if (appointmentDate < today) {
    return false;
  }

  // Check if date is not too far in the future (e.g., not more than 6 months)
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  if (appointmentDate > sixMonthsFromNow) {
    return false;
  }

  return true;
}; 