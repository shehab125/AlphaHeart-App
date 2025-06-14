import React from 'react'

import locationIcon from '../../assets/locationIcon.png'
import phoneIcon from '../../assets/phone.png'
import profilImage from '../../assets/profil_image2.png'
import webIcon from '../../assets/web.png'




const DoctorProfil = ({ id, branchId,zipCode, cityId, phone, website, title, firstName, lastName, avatar,cityName }) => {
 
  const URL = process.env.REACT_APP_BASE_URL
  const fileImage = avatar && `${URL}/uploads/${avatar}`




  return (
    <>
    <div className='flex flex-col justify-center items-center p-1 profil-doctor'>
    <img className='doctor-image' src={fileImage || profilImage} alt="doctor-pic"/>
      <h1 className='text-xl font-bold doctor-profil-name'> {title}. {firstName} {lastName}</h1>
      <h2 className='text-xl doctor-profil-name'>{branchId?.name}</h2>
      </div>  
      <div className='flex justify-start doctor-profil-location'>
        <img src={locationIcon} className="mr-3 w-4 h-6" alt="locationIcon" />
        <h3>{cityId?.name || cityName || zipCode % 2=== 0 ? "Berlin" : "Köln"}</h3>
      </div>
      <div className='flex doctor-profil-phone'>
        <img src={phoneIcon} className="mr-1 w-5 h-5" alt="phoneIcon" />
        <h3>{phone}</h3>
      </div>
      <div className='flex doctor-profil-website'>
      <img src={webIcon} className="mr-1 w-6 h-6" alt="webIcon" />
      {website ? <a href="www.example.com"> {website}</a> : "Keine Webseite Vorhanden"}
      </div>
      <p className='text-center text-main-dark-blue p-5 rounded-lg'>Please select a time in the calendar to schedule an appointment.</p>
      
    
    </>
    
  )
}

export default DoctorProfil