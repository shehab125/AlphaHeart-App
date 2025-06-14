import React, { useState, useMemo } from 'react'
import "./pNavbar.css"
import setting from "../../../../assets/setting2.png"
import letter from "../../../../assets/letter.png"
import notification2 from "../../../../assets/notification2.png"
import help from "../../../../assets/help.png"
import logo from "../../../../assets/logo3.png"
import { useNavigate } from 'react-router-dom'
import NotificationModal from "./NotificationModal";
import moment from "moment";

const PNavbar = ({ doctors, messages, appointments }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Memoize the appointment filtering
  const findAppo = useMemo(() => {
    const tomorrow = moment().add(1, 'days');
    return Array.isArray(appointments) ? appointments.filter(item => 
      (item.date === tomorrow.format('YYYY-MM-DD') && item.isReadPat === false) || 
      (item.isCancelledDr && item.isReadPat === false)
    ) : [];
  }, [appointments]);

  // Memoize the message processing
  const findUser = useMemo(() => {
    let messageArray = [];
    let result = [];

    if (Array.isArray(messages)) {
      messages.forEach((item) => {
        messageArray.push(item.senderUserId);
        messageArray.push(item.receiverUserId);
      });
    }

    const uniqueIds = new Set(messageArray);
    const uniqueIdsArray = Array.from(uniqueIds);

    if (Array.isArray(doctors?.data)) {
      uniqueIdsArray.forEach((element) => {
        const users = doctors.data.filter(
          (item) => item.id === element && !item.isChecked
        );
        if (users) {
          result.push(...users);
        }
      });
    }

    return result;
  }, [messages, doctors]);

  return (
    <div className="d-header">
      <img className="d-header-img" src={logo} alt="logo" />
      <div className="d-navbar-icons min-w-[200px]">
        <div onClick={() => navigate("message")} className="relative h-[35px] w-[35px] cursor-pointer">
          <span className={`absolute bottom-4 left-[-12px] ${findUser?.length === 0 ? "hidden" : ""}`}>
            {findUser?.length}
          </span>
          <img src={letter} alt="letter" className="absolute top-[6.5px]"/>
        </div>
        <div onClick={() => setShowModal(!showModal)} className="relative cursor-pointer">
          <span className={`absolute bottom-4 left-[-12px] ${findAppo?.length === 0 ? "hidden" : ""}`}>
            {findAppo?.length}
          </span>
          <img src={notification2} alt="notification2" />
        </div>
        <img src={help} alt="help" />
        <img src={setting} alt="setting" />
      </div>
      <NotificationModal
        showModal={showModal}
        setShowModal={setShowModal}
        notifications={findAppo}
      />
    </div>
  );
}

export default PNavbar;