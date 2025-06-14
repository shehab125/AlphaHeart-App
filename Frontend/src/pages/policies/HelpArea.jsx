import React from 'react';

const HelpArea = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-main-dark-blue mb-8 text-center">Help Area</h1>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-main-dark-blue">Frequently Asked Questions</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-main-dark-blue">How do I book an appointment?</h3>
              <p className="text-gray-700 mb-4">To book an appointment, follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Search for a doctor using our search function</li>
                <li>Select an available time slot from the doctor's calendar</li>
                <li>Fill in your symptoms and confirm the appointment</li>
                <li>You will receive a confirmation email</li>
              </ol>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-main-dark-blue">How can I cancel an appointment?</h3>
              <p className="text-gray-700 mb-4">You can cancel your appointment by:</p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Logging into your account</li>
                <li>Going to your appointments section</li>
                <li>Selecting the appointment you want to cancel</li>
                <li>Clicking the cancel button</li>
              </ol>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-main-dark-blue">What if I need to reschedule?</h3>
              <p className="text-gray-700 mb-4">To reschedule an appointment:</p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Cancel your existing appointment</li>
                <li>Book a new appointment at your preferred time</li>
              </ol>
            </div>
          </section>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">Contact Support</h2>
            <p className="text-gray-700 mb-4">If you need additional help, please contact our support team:</p>
            <div className="space-y-2 text-gray-700">
              <p>Email: support@alphaheart.com</p>
              <p>Phone: +49 (0) 123 456789</p>
              <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM CET</p>
            </div>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">Technical Support</h2>
            <p className="text-gray-700 mb-4">For technical issues, please include the following information in your support request:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Your account email</li>
              <li>Description of the issue</li>
              <li>Steps to reproduce the problem</li>
              <li>Screenshots if applicable</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpArea; 