import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useDataCall from '../../../hooks/useDataCall';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

const defaultWorkingHours = [
  { day: 'Monday', start: '', end: '' },
  { day: 'Tuesday', start: '', end: '' },
  { day: 'Wednesday', start: '', end: '' },
  { day: 'Thursday', start: '', end: '' },
  { day: 'Friday', start: '', end: '' },
  { day: 'Saturday', start: '', end: '' },
  { day: 'Sunday', start: '', end: '' },
];

const DoctorSettingsModern = () => {
  const { userId } = useSelector((state) => state.auth);
  const { putData, getData } = useDataCall();
  const { doctors } = useSelector((state) => state.data);
  const doctor = doctors?.data?.find(doc => doc._id === userId);

  // Debug: log the doctors object
  useEffect(() => {
    console.log('Redux doctors:', doctors);
  }, [doctors]);

  // Ensure doctor data is fetched if missing
  useEffect(() => {
    if (!doctors || !doctors.data || doctors.data.length === 0) {
      getData("doctors");
    }
  }, [doctors, getData]);

  // State for price
  const [price, setPrice] = useState('');
  const [priceMsg, setPriceMsg] = useState('');

  // State for working hours
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [hoursMsg, setHoursMsg] = useState('');

  // State for password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // State for booking toggle
  const [acceptingBookings, setAcceptingBookings] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    fee: 0,
    workingSchedule: []
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  useEffect(() => {
    if (doctor) {
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience || "",
        fee: doctor.fee || 0,
        workingSchedule: doctor.workingSchedule || []
      });
    }
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctor) {
      toast.error("Doctor data not loaded yet!");
      return;
    }
    try {
      await putData("doctors", doctor._id, {
        ...formData,
        fee: Number(formData.fee),
        workingSchedule: formData.workingSchedule
      });
      await getData("doctors"); // Fetch updated doctor data after saving
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
      console.error(error);
    }
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setFormData(prev => {
      const hours = [...prev.workingHours];
      const dayIndex = hours.findIndex(h => h.day === day);
      
      if (dayIndex === -1) {
        hours.push({ day, [field]: value });
      } else {
        hours[dayIndex] = { ...hours[dayIndex], [field]: value };
      }
      
      return { ...prev, workingHours: hours };
    });
  };

  // Handlers
  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    try {
      await putData('doctors', userId, { appointmentPrice: price });
      setPriceMsg('Price updated successfully!');
    } catch {
      setPriceMsg('Error updating price.');
    }
    setTimeout(() => setPriceMsg(''), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg('Passwords do not match!');
      setTimeout(() => setPassMsg(''), 3000);
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/auth/change-password', { userId, oldPassword, newPassword });
      setPassMsg('Password changed successfully!');
    } catch (err) {
      setPassMsg('Error changing password.');
    }
    setTimeout(() => setPassMsg(''), 3000);
  };

  const handleBookingToggle = async () => {
    try {
      await putData('doctors', userId, { acceptingBookings: !acceptingBookings });
      setAcceptingBookings((prev) => !prev);
      setBookingMsg('Booking status updated!');
    } catch {
      setBookingMsg('Error updating booking status.');
    }
    setTimeout(() => setBookingMsg(''), 3000);
  };

  const handleAddWorkingDay = () => {
    const newSchedule = {
      date: selectedDate,
      startTime,
      endTime,
      isAvailable: true
    };

    // Check if this date already exists in the schedule
    const existingIndex = formData.workingSchedule.findIndex(
      schedule => new Date(schedule.date).toDateString() === selectedDate.toDateString()
    );

    if (existingIndex !== -1) {
      // Update existing schedule
      const updatedSchedule = [...formData.workingSchedule];
      updatedSchedule[existingIndex] = newSchedule;
      setFormData(prev => ({
        ...prev,
        workingSchedule: updatedSchedule
      }));
    } else {
      // Add new schedule
      setFormData(prev => ({
        ...prev,
        workingSchedule: [...prev.workingSchedule, newSchedule]
      }));
    }

    toast.success("Working day added successfully!");
  };

  const handleRemoveWorkingDay = (date) => {
    setFormData(prev => ({
      ...prev,
      workingSchedule: prev.workingSchedule.filter(
        schedule => new Date(schedule.date).toDateString() !== new Date(date).toDateString()
      )
    }));
    toast.success("Working day removed successfully!");
  };

  const tileClassName = ({ date }) => {
    const isWorkingDay = formData.workingSchedule.some(
      schedule => new Date(schedule.date).toDateString() === date.toDateString()
    );
    return isWorkingDay ? 'working-day' : null;
  };

  useEffect(() => {
    // Fetch doctor data on mount
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/doctors/${userId}`);
        if (res.data?.data?.appointmentPrice !== undefined) {
          setPrice(res.data.data.appointmentPrice);
        }
      } catch (err) {
        // ignore
      }
    };
    if (userId) fetchDoctor();
  }, [userId]);

  return (
    <div className="main-content p-6">
      <h2 className="text-2xl font-bold mb-6">Doctor Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Consultation Fee ($)</label>
              <input
                type="number"
                value={formData.fee}
                onChange={(e) => setFormData({...formData, fee: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Working Schedule */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Working Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={new Date()}
                tileClassName={tileClassName}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddWorkingDay}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Working Day
              </button>
            </div>
          </div>

          {/* Working Days List */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-3">Scheduled Working Days</h4>
            <div className="space-y-2">
              {formData.workingSchedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">
                      {new Date(schedule.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveWorkingDay(schedule.date)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
      <ToastContainer />

      <style>{`
        .working-day {
          background-color: #e3f2fd !important;
          color: #1976d2 !important;
        }
      `}</style>
    </div>
  );
};

export default DoctorSettingsModern; 