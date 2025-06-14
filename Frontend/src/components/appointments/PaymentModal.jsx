import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, appointment, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setError(null);
      setIsConfirmed(false);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!appointment) {
      toast.error("No appointment selected");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const paymentData = {
        status: "confirmed",
        paymentStatus: "pending",
        isReadPat: true,
        isReadDr: false
      };

      const response = await axios.put(`/api/appointments/${appointment._id}`, paymentData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to confirm appointment');
      }

      setIsConfirmed(true);
      toast.success("تم تأكيد الموعد بنجاح");
      
      // Wait for 2 seconds before closing the modal
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);

    } catch (error) {
      console.error('Error confirming appointment:', error);
      setError(error.message || 'حدث خطأ في تأكيد الموعد');
      toast.error(error.message || 'حدث خطأ في تأكيد الموعد');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-right">تأكيد الموعد</h2>
        
        <div className="mb-6">
          <p className="text-right mb-2">
            <span className="font-bold">التاريخ:</span> {appointment.date}
          </p>
          <p className="text-right mb-2">
            <span className="font-bold">الوقت:</span> {appointment.timeStart}
          </p>
          <p className="text-right mb-2">
            <span className="font-bold">السعر:</span> {appointment.price} جنيه
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2 text-right">تعليمات الدفع:</h3>
          <p className="text-right mb-2">
            يرجى تحويل المبلغ إلى رقم فودافون كاش الخاص بالدكتور
          </p>
          <p className="text-right text-sm text-gray-600">
            بعد التحويل، اضغط على زر "تأكيد الدفع" لإكمال عملية الحجز
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-right">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || isConfirmed}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "جاري التحميل..." : isConfirmed ? "تم التأكيد" : "تأكيد الدفع"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 