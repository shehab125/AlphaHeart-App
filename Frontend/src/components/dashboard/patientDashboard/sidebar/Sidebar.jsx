import React, { memo } from 'react'
import "./sidebar.css"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthCall from '../../../../hooks/useAuthCall'
import profil_image from "../../../../assets/profil_image.png"
import profil_info from "../../../../assets/profil_info.png"
import dashboard from "../../../../assets/dashboard.png"
import statistic from "../../../../assets/statistic.png"
import calender from "../../../../assets/calender.png"
import message from "../../../../assets/message.png"
import exit from "../../../../assets/logout.png"
import task from "../../../../assets/task.png"
import { useSelector } from 'react-redux'

const Sidebar = memo(() => {
  const { user, userId } = useSelector((state) => state.auth);
  console.log("Sidebar User:", user);
  const { logout } = useAuthCall();
  const navigate = useNavigate();
  const location = useLocation();

  const URL = process.env.REACT_APP_BASE_URL
  const fileImage = user.profilePic && `${URL}/uploads/${user.profilePic}`

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar-main">
      <div className="topSlide">
        <div className="top">
          <div className="sidebar-avatar-img"><img src={fileImage || profil_image} alt="profil_image" /></div>
          <div className="sidebar-avatar-name"><h1>{user.firstName} {user.lastName}</h1></div>
        </div>
      </div>
      <div className="middleSlide">
        <div 
          className={`mid middle1 ${isActive('/patient') ? 'active' : ''}`} 
          onClick={() => handleNavigation('/patient')}
        >
          <img src={dashboard} alt="dashboard" /> <h1>Overview</h1>
        </div>
        <div 
          className={`mid middle2 ${isActive('/patient/profile') ? 'active' : ''}`} 
          onClick={() => handleNavigation('/patient/profile')}
        >
          <img src={profil_info} alt="profil_info" /> <h1>Profile</h1>
        </div>
        <div 
          className={`mid middle3 ${isActive('/patient/my-calender') ? 'active' : ''}`} 
          onClick={() => handleNavigation('/patient/my-calender')}
        >
          <img src={calender} alt="calender" /> <h1>Calendar</h1>
        </div>
        <div 
          className={`mid middle4 ${isActive('/patient/message') ? 'active' : ''}`} 
          onClick={() => handleNavigation('/patient/message')}
        >
          <img src={message} alt="message" /> <h1>Messages</h1>
        </div>
        <div 
          className={`mid middle5 ${isActive('/patient/task') ? 'active' : ''}`} 
          onClick={() => handleNavigation('/patient/task')}
        >
          <img src={task} alt="task" /> <h1>Tasks</h1>
        </div>
        <div 
          className={`mid middle6 ${isActive('/patient/statistic') ? 'active' : ''}`} 
          onClick={() => handleNavigation('/patient/statistic')}
        >
          <img src={statistic} alt="statistic" /> <h1>Statistics</h1>
        </div>
        {user.device?.isLinked && (
          <div
            className={`mid middle7 ${isActive('/patient/device-measurements') ? 'active' : ''}`}
            onClick={() => handleNavigation('/patient/device-measurements')}
          >
            <img src={statistic} alt="device" /> <h1>Device Measurements</h1>
          </div>
        )}
      </div>
      <div className="bottomSlide">
        <div className="mid bottom1" onClick={handleLogout}>
          <img src={exit} alt="exit" /> <h1>Logout</h1>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;