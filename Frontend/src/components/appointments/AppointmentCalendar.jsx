import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAppointments, setLoading, setError } from "../../redux/actions/appointmentsActions";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import PaymentModal from './PaymentModal';
import "./AppointmentCalendar.css";

const AppointmentCalendar = ({ id, firstName, lastName, fee }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAppointments = useCallback(async () => {
    if (!id) {
      console.log('No doctor ID available');
      return;
    }

    try {
      dispatch(setLoading(true));
      setLocalLoading(true);
      setLocalError(null);

      const formattedDate = formatDate(selectedDate);
      console.log('Fetching appointments for:', {
        doctorId: id,
        date: formattedDate
      });

      const response = await axios.post('http://localhost:8000/api/appointments/day', {
        doctorId: id,
        date: formattedDate
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      console.log('Appointments response:', response.data);

      if (response.data.success && response.data.data) {
        // Filter out duplicate timeStart slots
        const uniqueAppointments = response.data.data.filter(
          (slot, index, self) =>
            index === self.findIndex((s) => s.timeStart === slot.timeStart)
        );
        const bookedTimes = uniqueAppointments
          .filter(app => app.patientId)
          .map(app => app.timeStart);
        console.log('Booked times:', bookedTimes);
        setBookedSlots(new Set(bookedTimes));
        dispatch(setAppointments(uniqueAppointments));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch appointments';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  }, [id, selectedDate, dispatch, token]);

  useEffect(() => {
    console.log('Selected date changed:', selectedDate);
    console.log('Doctor ID:', id);
    fetchAppointments();
  }, [selectedDate, id, fetchAppointments]);

  const handleDateChange = (date) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
  };

  const handleHourClick = async (timeStart) => {
    console.log('Slot clicked:', timeStart);
    
    if (bookedSlots.has(timeStart)) {
      toast.error('هذا الموعد محجوز بالفعل');
      return;
    }

    if (!user) {
      toast.error('يجب تسجيل الدخول لحجز موعد');
      navigate('/login');
      return;
    }

    try {
      setLocalLoading(true);
      
      // Use doctor information from props
      const appointmentPrice = fee || 150;

      // Use patient information from Redux store
      const insuranceType = user.insuranceType || 'Private';

      const appointmentData = {
        doctorId: id,
        date: formatDate(selectedDate),
        timeStart: timeStart,
        timeEnd: calculateTimeEnd(timeStart),
        patientId: user.id,
        patientName: user.firstName + ' ' + user.lastName, // Corrected patientName
        price: appointmentPrice,
        status: 'pending',
        paymentStatus: 'pending',
        isReadPat: true,
        isReadDr: false,
        insuranceType: insuranceType,
        duration: 30,
        patientFee: Math.round(appointmentPrice * 1.1),
        doctorReceives: Math.round(appointmentPrice * 0.9),
        platformCommission: Math.round(appointmentPrice * 0.1)
      };

      console.log('Booking appointment:', appointmentData);

      const response = await axios.post('http://localhost:8000/api/appointments', appointmentData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      if (response.data.success) {
        await fetchAppointments();
        if (typeof window.refreshPatientAppointments === 'function') {
          window.refreshPatientAppointments();
        }
        setSelectedAppointment(response.data.data);
        setShowPaymentModal(true);
      } else {
        throw new Error(response.data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في حجز الموعد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLocalLoading(false);
    }
  };

  const calculateTimeEnd = (timeStart) => {
    const [hours, minutes] = timeStart.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes + 30, 0);
    return `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setSelectedAppointment(null);
    await fetchAppointments();
    toast.success('تم حجز الموعد بنجاح');
  };

  console.log('Current state:', {
    selectedDate,
    appointments: appointments?.length,
    bookedSlots: Array.from(bookedSlots),
    loading,
    error,
    doctorId: id
  });

  return (
    <div className="appointment-calendar">
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
          className="react-calendar"
        />
      </div>

      <div className="available-slots">
        <h3>المواعيد المتاحة</h3>
        <div className="slots-grid">
          {loading ? (
            <div className="loading">جاري التحميل...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : appointments && appointments.length > 0 ? (
            appointments.map((slot) => {
              const isBooked = bookedSlots.has(slot.timeStart);
              return (
                <button
                  key={slot.timeStart}
                  className={`slot-button ${isBooked ? 'booked' : ''}`}
                  onClick={() => handleHourClick(slot.timeStart)}
                  disabled={isBooked || loading}
                >
                  {slot.timeStart}
                </button>
              );
            })
          ) : (
            <div className="no-slots">لا توجد مواعيد متاحة لهذا اليوم</div>
          )}
        </div>
      </div>

      {showPaymentModal && selectedAppointment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;


