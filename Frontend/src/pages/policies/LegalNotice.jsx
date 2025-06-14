import React from 'react';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-main-dark-blue mb-8 text-center">Legal Notice</h1>
          
          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">Information according to § 5 TMG</h2>
            <div className="space-y-2 text-gray-700">
              <p>AlphaHeart GmbH</p>
              <p>Musterstraße 123</p>
              <p>12345 Berlin</p>
              <p>Germany</p>
            </div>
          </section>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">Contact</h2>
            <div className="space-y-2 text-gray-700">
              <p>Phone: +49 (0) 123 456789</p>
              <p>Email: contact@alphaheart.com</p>
            </div>
          </section>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">Responsible for content</h2>
            <div className="space-y-2 text-gray-700">
              <p>John Doe</p>
              <p>AlphaHeart GmbH</p>
              <p>Musterstraße 123</p>
              <p>12345 Berlin</p>
              <p>Germany</p>
            </div>
          </section>

          <section className="mb-10 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">EU Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">The European Commission provides a platform for online dispute resolution (OS):</p>
            <a href="https://ec.europa.eu/consumers/odr/" className="text-main-light-blue hover:text-main-dark-blue underline">
              https://ec.europa.eu/consumers/odr/
            </a>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-main-dark-blue">Consumer dispute resolution/Universal arbitration board</h2>
            <p className="text-gray-700">We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice; 