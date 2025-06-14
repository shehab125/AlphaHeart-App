import React, { useState } from 'react'
import "./pManagement.css"
import profileImg from "../../../../assets/profil_image2.png"


import okImg from "../../../../assets/ok.png"
import deleteImg from "../../../../assets/delete.png"
import pendingImg from "../../../../assets/pending.png"
import okImg2 from "../../../../assets/ok2.png"
import deleteImg2 from "../../../../assets/delete2.png"
import pendingImg2 from "../../../../assets/pending2.png"
import useDataCall from '../../../../hooks/useDataCall'

const URL = process.env.REACT_APP_BASE_URL

const PManagementCard = ({ id,profilePic, firstName, lastName, cityName, street, zipCode, email, phone, isActive, device }) => {
  const { delData, putData, getData, getSingleData } = useDataCall()

  let fileImage = profileImg;

  if(profilePic) {
    fileImage = `${URL}/uploads/${profilePic}`
   }

  return (
    <div className="apanel-p-view--main">
      <div className="apanel-p-view-patient">
        <div className="apanel-p-view-patient-left">
          <div className="apanel-p-view-patientImg">
            <img src={fileImage} alt="" />
          </div>
          <div className="apanel-p-view-patientInfo">
            <ul>
              <div className='patientInfo1'>
                <li> <span>Name:</span> {firstName} {lastName}</li>
                <li> <span>Address:</span> {street}, {zipCode} {cityName}</li>
                <li> <span>Email:</span> {email}</li>
                <li> <span>Phone:</span> {phone}</li>
                <li>
                  <span>Medical Device:</span> {device?.isLinked ? (
                    <span style={{color: 'green', fontWeight: 'bold'}}>✓ Linked</span>
                  ) : (
                    <button
                      style={{marginLeft: 8, padding: '2px 8px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none'}}
                      onClick={() => {
                        const serial = window.prompt('Enter device serial number (optional):');
                        putData("patients", id, { device: { isLinked: true, serial, addedAt: new Date() } })
                          .then(async response => {
                            console.log("Device link response:", response);
                            console.log("Full response:", JSON.stringify(response, null, 2));
                            // Refresh patient data after linking device
                            await getData('patients');
                            await getSingleData('patients', id);
                          })
                          .catch(error => {
                            console.error("Error linking device:", error);
                          });
                      }}
                    >Link Device</button>
                  )}
                </li>
              </div>

              



            </ul>

          </div>
        </div>
        <div className="apanel-p-view-patient-right-btn">
        <div className="apanel-p-view-patient-btn">
          
   
          </div>
          <div className="apanel-p-view-patientInfo-Ok">
            <div className="okIcons">
              <div className="okIconsFlex okIconsFlex1" onClick={() => putData("patients", id, { isActive: false })}>
                <img src={isActive ? pendingImg2 : pendingImg} alt="" />
                <p>Pending</p>
              </div>

              <div className="okIconsFlex okIconsFlex2">
                <img src={deleteImg2} alt="" />
                <p onClick={() => delData("patients", id)}>Delete</p>
              </div>

              <div className="okIconsFlex okIconsFlex3" onClick={() => putData("patients", id, { isActive: true })}>
                <img src={isActive ? okImg : okImg2} alt="" />
                <p>Approved</p>
              </div>
            </div>
          </div>
          
        </div>



      </div>


    </div>
  )
}

export default PManagementCard