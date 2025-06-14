// Home.jsx
import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import Hero from "../../components/home/hero/Hero";
import Contact from "../contact/Contact";
import About from "../about/About";
import Services from "../services/Services";
import NearbyPlaces from "../../components/home/nearby/NearbyPlaces";
import useDataCall from "../../hooks/useDataCall";
import { Link } from 'react-router-dom';
import { FaHospital, FaClinicMedical, FaUserMd, FaCalendarAlt, FaMapMarkerAlt, FaPills } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { getData } = useDataCall();
    const { t } = useTranslation();

    useEffect(() => {
        getData("doctors");
    }, [getData]);

    return (
        <div className="min-h-screen bg-[#f3f6fb] flex flex-col w-full" id="home">
            {/* Modern Header */}
            <Header />
            <main className="mt-[100px] w-full flex flex-col gap-16">
                {/* Hero Section */}
                <section className="w-full max-w-7xl mx-auto px-4">
                    <Hero />
                </section>
                {/* Services Section */}
                <section id="services" className="w-full max-w-7xl mx-auto px-4">
                    <Services />
                </section>
                {/* Nearby Pharmacies Button Only */}
                <section id="nearby" className="w-full max-w-7xl mx-auto px-4">
                    <NearbyPlaces />
                </section>
                {/* About Section */}
                <section id="about" className="w-full max-w-7xl mx-auto px-4">
                    <About />
                </section>
                {/* Contact Section */}
                <section id="contact" className="w-full max-w-7xl mx-auto px-4 pb-16">
                    <Contact />
                </section>
            </main>
        </div>
    );
};

export default Home;
