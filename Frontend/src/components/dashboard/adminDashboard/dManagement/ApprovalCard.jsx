import React, { useState } from 'react'
import "./dManagement.css"
import profileImg from "../../../../assets/profil_image2.png"
import fileImg from "../../../../assets/about-img.png"
import okImg from "../../../../assets/ok.png"
import pendingImg from "../../../../assets/pending.png"
import okImg2 from "../../../../assets/ok2.png"
import deleteImg2 from "../../../../assets/delete2.png"
import pendingImg2 from "../../../../assets/pending2.png"
import useDataCall from '../../../../hooks/useDataCall'
import { toast } from 'react-hot-toast'

const ApprovalCard = ({ id, firstName, lastName, title, branch, cityName, street, zipCode, email, phone, website, languages, complaints, isApproved, about, avatar, doc, files
}) => {

  const { delData, putData } = useDataCall()

  const URL = process.env.REACT_APP_BASE_URL

  let fileImage = profileImg
  const handleDownload = () => {
    if (!doc) {
      toast.error("No certificate available for download.")
      return
    }
    window.open(`${URL}/uploads/${doc}`, '_blank')
  }
  if(avatar) {fileImage = `${URL}/uploads/${avatar}`}
  const fileDoc = `${URL}/uploads/${doc}` || fileImg
   
  return (
    <div className="apanel-view--main">
      <div className="apanel-view-doctor">
        <div className="apanel-view-doctor-left">
          <div className="apanel-view-doctorImg">
            <img src={fileImage} alt="" />
          </div>
          <div className="apanel-view-doctorInfo">
            <ul>
              <div className='doctorInfo1'>
                <li >{title} {firstName} {lastName}</li>
                <li >{branch}</li>
                <li >{street}, {zipCode}</li>
                <li >{email}</li>
                <li>{phone}</li>
                <li >{cityName}</li>
              </div>

              <div className="apanel-view-doctor-right">
              <div className='apanel-view-doctor-info2'>
                    <h1>Webseite: </h1> <p> {website}</p>
                    <h1>Sprache: </h1> <p>{languages}</p>
                    <h1>Symptome: </h1> <p>{complaints}</p>
                    <h1>Über mich: </h1> <p> {about} </p>
                  </div>
          
              </div>
            </ul>

          </div>
        </div>
        <div className="apanel-view-doctor-right-btn">
        <div className="apanel-view-doctor-btn">
            <button onClick={() => handleDownload()}>License Certificate</button>
   
          </div>
          <div className="apanel-view-doctorInfo-Ok">
            <div className="okIcons">
              <div className="okIconsFlex okIconsFlex1" onClick={() => putData("doctors", id, { isApproved: false })}>
                <img src={isApproved ? pendingImg2 : pendingImg} alt="" />
                <p>Pending</p>
              </div>

              <div className="okIconsFlex okIconsFlex2">
                <img src={deleteImg2} alt="" />
                <p onClick={() => delData("doctors", id)}>Delete</p>
              </div>

              <div className="okIconsFlex okIconsFlex3" onClick={() => putData("doctors", id, { isApproved: true })}>
                <img src={isApproved ? okImg : okImg2} alt="" />
                <p>Approved</p>
              </div>
            </div>
          </div>    
        </div>
      </div>
      <div className="apanel-view-doctorInfo-title">
        <h2>License Certificate</h2>
      </div>
    </div>
  )
}

export default ApprovalCard