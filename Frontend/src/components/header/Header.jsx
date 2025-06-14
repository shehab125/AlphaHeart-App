// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/Logo2.png";
import userImg from "../../assets/user3.png";
import doctor from "../../assets/doctor.png";
import patient from "../../assets/patient.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuthCall from "../../hooks/useAuthCall";
import profilImage from "../../assets/profil_image2.png";
import { useTheme } from '../../context/ThemeContext';
import "./header.css";

const Header = () => {
    const { userId, user, userType } = useSelector((state) => state.auth);
    const { logout } = useAuthCall();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const URL = process.env.REACT_APP_BASE_URL;
    let fileImage = profilImage;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const scrollToSection = (sectionId) => {
        navigate("/");
        setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
                const headerOffset = 80;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
        }
        }, 100);
    };

    const navigation = [
        { title: "Home", path: "home" },
        { title: "Services", path: "services" },
        { title: "About", path: "about" },
        { title: "Contact", path: "contact" }
    ];

    const ProfileDropdown = () => {
        const dropdownRef = useRef(null);

    useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsProfileOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

        const menuItems = [
            { 
                title: "My Panel", 
                icon: "fas fa-user", 
                onClick: () => navigate(`/${userType}`) 
            },
            { 
                title: "Settings", 
                icon: "fas fa-cog", 
                onClick: () => navigate(`/${userType}/setting`) 
            },
            { title: "Logout", icon: "fas fa-sign-out-alt", onClick: handleLogout }
        ];

        fileImage = (user.profilePic || user.avatar) && `${URL}/uploads/${user.profilePic || user.avatar}`;

        return (
            <div className="profile-dropdown" ref={dropdownRef}>
                <button 
                    className="profile-button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <img src={fileImage} alt="Profile" className="profile-image" />
                </button>
                <div className={`dropdown-menu ${isProfileOpen ? 'active' : ''}`}>
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="dropdown-item"
                            onClick={() => {
                                item.onClick();
                                setIsProfileOpen(false);
                            }}
                        >
                            <i className={item.icon}></i>
                            {item.title}
                    </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <button onClick={() => scrollToSection("home")} className="navbar-brand">
                                <img src={logo} alt="AlphaHeart" style={{ height: '120px', width: 'auto', objectFit: 'contain' }} />
                            </button>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            {navigation.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToSection(item.path)}
                                    className="nav-link"
                                >
                                            {item.title}
                                        </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="theme-toggle-btn"
                                aria-label="Toggle theme"
                            >
                                <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} text-2xl`}></i>
                            </button>
                            {!userId ? (
                                <>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="btn btn-primary flex items-center"
                                    >
                                        <img src={patient} alt="Patient" className="w-5 h-5 mr-2" />
                                        Patient
                                    </button>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="btn btn-primary flex items-center"
                                    >
                                        Doctor
                                        <img src={doctor} alt="Doctor" className="w-5 h-5 ml-2" />
                                    </button>
                                </>
                            ) : (
                                <ProfileDropdown />
                            )}

                            <button
                                className="md:hidden text-gray-700"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <i className={`fas fa-${isMobileMenuOpen ? 'times' : 'bars'} text-2xl`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    {navigation.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                scrollToSection(item.path);
                                setIsMobileMenuOpen(false);
                            }}
                            className="nav-link w-full text-left"
                        >
                            {item.title}
                        </button>
                    ))}
            </div>
          </div> 
        </nav>
    );
};

export default Header;
