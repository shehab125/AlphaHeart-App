import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-main-dark-blue mb-8 text-center">Privacy Policy</h1>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">1. Data Protection at a Glance</h2>
            <h3 className="text-xl font-semibold mb-2 text-main-dark-blue">General Notes</h3>
            <p className="text-gray-700">The following notes provide a simple overview of what happens to your personal data when you visit our website.</p>
          </section>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">2. Data Collection on Our Website</h2>
            <h3 className="text-xl font-semibold mb-2 text-main-dark-blue">Cookies</h3>
            <p className="text-gray-700">Our website uses cookies. These are small text files that your web browser stores on your device. Cookies help us make our offer more user-friendly, effective, and secure.</p>
          </section>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">3. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Right to information</li>
              <li>Right to rectification</li>
              <li>Right to erasure</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
              <li>Right to object</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">4. Contact Information</h2>
            <p className="text-gray-700 mb-4">For questions about data protection, please contact:</p>
            <div className="space-y-2 text-gray-700">
              <p>AlphaHeart GmbH</p>
              <p>Data Protection Officer</p>
              <p>Musterstraße 123</p>
              <p>12345 Berlin</p>
              <p>Email: privacy@alphaheart.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 