import React, { useEffect } from 'react';
import { getData } from '../utils/api';

const Home = () => {
  useEffect(() => {
    getData("doctors");
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="AlphaHeart Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-blue-800">AlphaHeart</span>
        </div>
        <nav className="hidden md:flex gap-8 text-blue-800 font-semibold">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#about" className="hover:text-blue-600 transition">About</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>
        <div className="flex gap-4">
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition">Login</a>
          <a href="/register" className="bg-white border border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-bold hover:bg-blue-50 transition">Sign Up</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto w-full gap-10">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 leading-tight">
            Book Your Medical Appointment <span className="text-green-500">Easily & Securely</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            AlphaHeart helps you find trusted doctors, book appointments online, and manage your health—all in one place.
          </p>
          <a href="/register" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow transition">
            Get Started Now
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/hero-doctor.svg" alt="Doctor and Patient" className="w-full max-w-md rounded-2xl shadow-lg" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 text-center mb-10">Why AlphaHeart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f3f6fb] rounded-xl p-8 shadow flex flex-col items-center">
              <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Easy Online Booking</h3>
              <p className="text-gray-600 text-center">Book appointments with top doctors in just a few clicks—no phone calls needed.</p>
            </div>
            <div className="bg-[#f3f6fb] rounded-xl p-8 shadow flex flex-col items-center">
              <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Trusted & Verified Doctors</h3>
              <p className="text-gray-600 text-center">All doctors are certified and reviewed for your peace of mind.</p>
            </div>
            <div className="bg-[#f3f6fb] rounded-xl p-8 shadow flex flex-col items-center">
              <svg className="w-12 h-12 text-orange-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Secure Online Payments</h3>
              <p className="text-gray-600 text-center">Pay safely and easily for your appointments—your data is always protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your health?</h2>
          <p className="text-lg text-blue-100 mb-8">Join AlphaHeart today and connect with the best doctors in your area.</p>
          <a href="/register" className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow transition">
            Create Your Free Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 mt-auto border-t">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="AlphaHeart Logo" className="h-8 w-8" />
            <span className="text-blue-800 font-bold text-lg">AlphaHeart</span>
          </div>
          <div className="flex gap-6 text-blue-800 text-sm">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#contact" className="hover:underline">Contact</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
          </div>
          <div className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} AlphaHeart. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 