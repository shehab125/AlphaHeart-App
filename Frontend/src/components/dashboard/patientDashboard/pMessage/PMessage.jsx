import React, { useRef, useEffect, useState } from 'react';
import "./pMessage.css";
import send from "../../../../assets/send.png";
import okIcon from "../../../../assets/ok3.png";
import searchIcon from "../../../../assets/ic_baseline-search.png";
import useDataCall from '../../../../hooks/useDataCall';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../../../../features/dataSlice';
import avatar from "../../../../assets/profil_image.png"
import messageImg from "../../../../assets/service-img1.png"
import messageIcon from "../../../../assets/new-message.png"
import Loading from '../../../../pages/loading/Loading';
import MessageFindDoctor from './messageFindDoctor/MessageFindDoctor';
import LastMessageDoctor from './lastMessageDoctor/LastMessageDoctor';

const PMessage = ({ patientProfile }) => {
    const { loading, messages, doctors } = useSelector((state) => state.data);
    const { userId } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
  
    const { postData, putData } = useDataCall();
    const URL = process.env.REACT_APP_BASE_URL;
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState({});
    const [messageContent, setMessageContent] = useState("");
   
    const messageAvatar = patientProfile?.profilePic ? `${URL}/uploads/${patientProfile.profilePic}` : null;
    const messageAvatar2 = doctorInfo?.avatar ? `${URL}/uploads/${doctorInfo.avatar}` : null;
    
    const messageInputRef = useRef(null);
    const messageContainerRef = useRef(null);
    const searchDoctorRef = useRef({ name: "" });

    const handleSearch = (e) => {
        e.preventDefault();
        if (!doctors?.data) return;
        
        const filteredResults = doctors.data.filter((doctor) => {
            if (!doctor) return false;
            const nameMatch = doctor.firstName?.toLowerCase().includes(searchDoctorRef.current.name?.toLowerCase()) || 
                            doctor.lastName?.toLowerCase().includes(searchDoctorRef.current.name?.toLowerCase()) || 
                            false;
            return nameMatch;
        });
        setFilteredDoctors(filteredResults);
    };

    const handleInputChange = (value) => {
        setMessageContent(value);
    };

    const handleInputChange2 = (field, value) => {
        searchDoctorRef.current = {
            ...searchDoctorRef.current,
            [field]: value,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!messageContent.trim() || !doctorInfo?.id) {
            return;
        }

        const newMessage = {
            senderUserId: patientProfile?.id,
            senderUserType: "patient",
            senderName: `${patientProfile?.firstName} ${patientProfile?.lastName}`,
            receiverUserId: doctorInfo?.id,
            receiverName: `${doctorInfo?.title} ${doctorInfo?.firstName} ${doctorInfo?.lastName}`,
            receiverUserType: "doctor",
            content: messageContent
        };

        try {
            await postData("messages", newMessage);
            dispatch(addMessage(newMessage));
            
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
            
            if (messageInputRef.current) {
                messageInputRef.current.value = "";
            }
            
            setMessageContent("");
            await putData("patients", userId, { isChecked: false });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages, doctorInfo]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const [date, time] = dateString.split('T');
            return `${date} ${time.substring(0, 8)}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    return (
        <div className="p-message-main">
            <div className="p-message-main-left">
                <div className="p-message-main-left-title">
                    <span>{patientProfile?.firstName} {patientProfile?.lastName}</span>
                    <h1>Messages</h1>
                    <span>{doctorInfo?.title} {doctorInfo?.firstName} {doctorInfo?.lastName}</span>
                </div>
                <div className="p-message-main-show" ref={messageContainerRef}>
                    {messages?.map((item, i) => (
                        <div key={i}>
                            {item.senderUserId === userId && item.receiverUserId === doctorInfo?.id && (
                                <div className="p-message-main-show-left">
                                    <p className="p-message-main-content">{item.content}</p>
                                    <div className="p-message-main-show-box">
                                        <div className="p-message-main-show-img-box">
                                            <img src={messageAvatar || avatar} alt="" />
                                        </div>
                                        <div className="p-message-main-show-date-box">
                                            <p className="p-message-date">{formatDate(item.createdAt)}</p>
                                            <img src={okIcon} alt="okIcon" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {item.senderUserId === doctorInfo?.id && item.receiverUserId === userId && (
                                <div className="p-message-main-show-right-main">
                                    <div className="p-message-main-show-right">
                                        <p className="p-message-main-content-right">{item.content}</p>
                                        <div className="p-message-main-show-box-right">
                                            <div className="p-message-main-show-date-box-right">
                                                <img src={okIcon} alt="okIcon-right" />
                                                <p className="p-message-date">{formatDate(item.createdAt)}</p>
                                            </div>
                                            <div className="p-message-main-show-img-box-right">
                                                <img src={messageAvatar2 || avatar} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-message-main-write">
                    <form onSubmit={handleSubmit}>
                        <div className="p-message-main-write-box">
                            <div className="p-message-main-write-box-left">
                                <img src={messageIcon} alt="" />
                            </div>
                            <input
                                type="text"
                                placeholder={!doctorInfo?.id ? 'Please select a doctor to send a message to.' : 'Messages...'}
                                ref={messageInputRef}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onBlur={(e) => {
                                    if (!e.target.value.trim() && doctorInfo?.id) {
                                        e.target.placeholder = "Messages...";
                                    }
                                }}
                            />
                            <div className="p-message-main-write-box-right">
                                <button type='submit'><img src={send} alt="" /></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="p-message-main-right">
                <form onSubmit={handleSearch}>
                    <div className="p-message-input">
                        <div className="p-message-input-box">
                            <div><img src={searchIcon} alt="searchIcon" /></div>
                            <div>
                                <input
                                    type="text"
                                    className="p-message-input-field"
                                    placeholder='Name'
                                    onChange={(e) => handleInputChange2('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <button type="submit" className="p-message-input-btn">Search</button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-message-findDoctor-main">
                    {loading ? (
                        <Loading />
                    ) : filteredDoctors?.length ? (
                        <div className="p-message-findDoctor">
                            {filteredDoctors?.map((item, i) => (
                                <MessageFindDoctor 
                                    setDoctorInfo={setDoctorInfo} 
                                    key={i} 
                                    {...item} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-message-findDoctor-info-main">
                            <div className="p-message-findDoctor-info-title">
                                <h1>Messages Service</h1>
                            </div>
                            <div className="p-message-findDoctor-info">
                                <div className="p-message-findDoctor-info-left">
                                    <img src={messageImg} alt="" />
                                </div>
                                <div className="p-message-findDoctor-info-right">
                                    <p className="p-message-findDoctor-info-text">
                                        The doctor you are looking for can be found in the search engine.
                                    </p>
                                    <p className="p-message-findDoctor-info-text">
                                        Below you can access your latest messages and quickly find doctors from whom you have sent and received messages.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <LastMessageDoctor 
                        setDoctorInfo={setDoctorInfo} 
                        messages={messages} 
                        doctors={doctors} 
                        patientId={userId} 
                    />
                </div>
            </div>
        </div>
    );
};

export default PMessage;
