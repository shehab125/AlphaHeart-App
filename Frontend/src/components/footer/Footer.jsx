import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="copyright">
        <div className="text-center text-white">
          <p>Copyright © 2024 - AlphaHeart Web Design</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/legal-notice" className="hover:text-main-light-blue2">Legal Notice</Link>
            <Link to="/privacy-policy" className="hover:text-main-light-blue2">Privacy Policy</Link>
            <Link to="/help-area" className="hover:text-main-light-blue2">Help Area</Link>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Footer;
