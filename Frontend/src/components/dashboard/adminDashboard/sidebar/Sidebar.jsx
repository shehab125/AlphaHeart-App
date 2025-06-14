import React, { useState } from 'react'
import "./sidebar.css"
import { useNavigate } from 'react-router-dom'
import useAuthCall from '../../../../hooks/useAuthCall'
import profil_image2  from "../../../../assets/profil_image2.png"
import profil_image from "../../../../assets/profil_image.png"
import profil_info from "../../../../assets/profil_info.png"
import dashboard  from "../../../../assets/dashboard.png"
import statistic from "../../../../assets/statistic.png"
import calender from "../../../../assets/calender.png"
import setting  from "../../../../assets/setting.png"
import account from "../../../../assets/account.png"
import message from "../../../../assets/message.png"
import exit from "../../../../assets/logout.png"
import home from "../../../../assets/home.png"
import task from "../../../../assets/task.png"
import { useSelector } from 'react-redux'




const Sidebar = () => {
  const { user, userId } = useSelector((state) => state.auth);
  const { logout } = useAuthCall();
  const navigate = useNavigate();
  const [open, setOpen] = useState(window.innerWidth > 900);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const URL = process.env.REACT_APP_BASE_URL
  const fileImage = user.avatar && `${URL}/img/${userId.slice(-15)}.jpg`


  const closed = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <button className="sidebar-toggle-btn" onClick={() => setOpen(!open)}>
        <span style={{fontSize: 28}}>&#9776;</span>
      </button>
      {open && window.innerWidth <= 900 && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
      )}
      <div className={`sidebar-main${open ? '' : ' sidebar-hidden'}`}>
        <div className="topSlide">
          <div className="top">
            <div className="sidebar-avatar-img"><img src={fileImage || profil_image2} alt="profil_image" /></div> <div className="sidebar-avatar-name"><h1>{user.firstName} {user.lastName}</h1></div>
          </div>
        </div>
        <div className="middleSlide">
          {/* <div className="mid a-middle1" onClick={() => navigate("/admin")}>
            <img src={dashboard} alt="dashboard"/> <h1>Überblick</h1>
          </div> */}
          <div className="mid a-middle4" onClick={() => navigate("/admin/profile")}>
            <img src={profil_image2} alt="profil_image2"/> <h1>My Profile</h1>
          </div>
          <div className="mid a-middle2 w-20 hover:pr-[5px] leading-5" onClick={() => navigate("/admin/doctor-management")}>
            <img src={profil_info} alt="profil_info"/> <h1>Doctor Management</h1>
          </div>
          <div className="mid a-middle3 leading-5" onClick={() => navigate("/admin/patient-management")}>
            <img src={calender} alt="calender"/> <h1>Patient Management</h1>
          </div>
          <div className="mid a-middle3 leading-5" onClick={() => navigate("/admin/admin-management")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            <h1>Admin Management</h1>
          </div>
    
          {/* <div className="mid a-middle5" onClick={() => navigate("/admin/message")}>
            <img src={message} alt="message"/> <h1>Nachrichten</h1>
          </div> */}
          <div className="mid a-middle6" onClick={() => navigate("/admin/task")}>
            <img src={task} alt="task"/> <h1>Tasks</h1>
          </div>
    
          {/* <div className="mid a-middle7" onClick={() => navigate("/admin/setting")}>
            <img src={setting} alt="setting"/> <h1>Einstellung</h1>
          </div> */}
    
        </div>
    
        <div className="bottomSlide">
          {/* <div className="bot bottom1" onClick={() => navigate("/admin/account")}>
            <img src={account} alt="account"/> <h1>Mein Konto</h1>
          </div> */}
          <div className="bot bottom2" onClick={() => closed()}>
            <img src={exit} alt="logout"/> <h1>Logout</h1>
          </div>
          <div className="bot bottom3" onClick={() => navigate("/")}>
            <img src={home} alt="home"/> <h1>Home</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar