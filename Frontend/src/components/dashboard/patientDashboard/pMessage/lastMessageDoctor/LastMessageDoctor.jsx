import React from 'react';
import "./lastMessageDoctor.css";
import avatar from "../../../../../assets/profil_image.png";
import { useSelector } from 'react-redux';
import useDataCall from '../../../../../hooks/useDataCall';

const LastMessageDoctor = ({ setDoctorInfo }) => {
    const { messages, doctors } = useSelector(state => state.data);
    const { userId } = useSelector(state => state.auth);
    const { putData } = useDataCall();
    const URL = process.env.REACT_APP_BASE_URL;
   
    const handleClick = (doctor) => {
        setDoctorInfo({
            id: doctor.id,
            title: doctor.title,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
        });
        putData("doctors", doctor.id, { isChecked: true });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const [date, time] = dateString.split('T');
            return `${date} -- ${time.substring(0, 8)}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    // Get unique doctor IDs from messages
    const messageArray = messages?.reduce((acc, item) => {
        if (item.senderUserId && item.senderUserId !== userId) acc.push(item.senderUserId);
        if (item.receiverUserId && item.receiverUserId !== userId) acc.push(item.receiverUserId);
        return acc;
    }, []) || [];

    const uniqueIds = [...new Set(messageArray)].reverse();

    return (
        <>
            <h1 className="p-last-message-title">My Last Messages</h1>
            <div className="p-last-message-doctor-container">
                {uniqueIds.map((element, i) => {
                    const findDoctor = doctors?.data?.find(item => item.id === element);
                    if (!findDoctor) return null;

                    const doctorClassName = findDoctor?.isChecked ? "p-d-last-message" : "isChecked";
                    const imgSrc = findDoctor?.avatar ? `${URL}/img/${findDoctor.id.slice(-15)}.jpg` : null;
                    const messagesReverse = [...messages].reverse();
                    const lastDate = messagesReverse.find(item => 
                        item.senderUserId === findDoctor.id || item.receiverUserId === findDoctor.id
                    );

                    return (
                        <div onClick={() => handleClick(findDoctor)} key={i} className={doctorClassName}>
                            <div className="p-d-last-message-img">
                                <img className="h-[60px]" src={imgSrc || avatar} alt="" />
                            </div>
                            <div className="p-d-last-message-info">
                                <h1 className='font-bold'>{findDoctor.title} {findDoctor.firstName} {findDoctor.lastName}</h1>
                                <p>{formatDate(lastDate?.updatedAt)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default LastMessageDoctor;
