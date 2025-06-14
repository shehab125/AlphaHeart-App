import React, { useEffect, useRef, useState } from 'react'
import useDataCall from '../../../../hooks/useDataCall';
import "./pProfile.css"
import profilImage from "../../../../assets/profil_image2.png"
import successImg from "../../../../assets/success.png"
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { putSuccess, updateProfileImage } from '../../../../features/authSlice';

const PProfile = (patientProfile) => {
    const { putData, postData } = useDataCall()
    const dispatch = useDispatch();
    const { id, firstName, lastName, email, birthDate, gender, street, zipCode, cityName, phone, profilePic } = patientProfile
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null) // إضافة state لمعاينة الصورة
    const URL = process.env.REACT_APP_BASE_URL
    
    // إضافة timestamp لتجنب cache
    const getProfileImageUrl = (userId, profilePic) => {
      if (!profilePic) return profilImage;
      return `${URL}/uploads/${profilePic}?t=${Date.now()}`;
    };
    let fileImage = getProfileImageUrl(id, profilePic);

    const patientProfileRef = useRef({
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        street: street,
        zipCode: zipCode,
        cityName: cityName,
        phone: phone,
        profilePic: profilePic,
    })

    const handleInputChange = (field, value) => {
        patientProfileRef.current = {
            ...patientProfileRef.current,
            [field]: value
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        // إنشاء معاينة للصورة
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
            handleInputChange("profilePic", true); // تحديث profilePic إلى true
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // تحديث بيانات المستخدم
            await putData("patients", id, patientProfileRef.current);
            dispatch(putSuccess({ info: patientProfileRef.current }));
            
            // رفع الصورة إذا تم اختيار ملف
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('userId', id);
                
                const response = await postData("files", formData);
                if (response.data && response.data.filename) {
                  dispatch(updateProfileImage({ 
                      avatar: response.data.filename,
                      profilePic: response.data.filename 
                  }));
                }
                
                // إعادة تعيين معاينة الصورة
                setImagePreview(null);
                setFile(null);
                
                // إعادة تحميل الصفحة بعد ثانية واحدة لضمان ظهور الصورة الجديدة
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile!");
        }
    }

    return (
        <div className="p-panel-person-main">
            <div className="p-panel-main-right">
                <div className="p-panel-main-right--content">
                    <form id="p-uploadForm" encType="multipart/form-data" className="p-panel-person" onSubmit={handleSubmit}>
                        <div className="p-panel-person-profile">
                            <div className="p-panel-person--left">
                                <div className="p-p-input p-panel-main--profil-image">
                                    <div className="p-p-input-image">
                                        <img 
                                            src={imagePreview || fileImage} 
                                            alt="Profile Image" 
                                            onError={(e) => {
                                                e.target.src = profilImage;
                                            }}
                                        />
                                    </div>
                                    <div className="p-panel-p-profil-img">
                                        <div className="p-panel-p-profil-img-right">
                                            <div className="p-panel-p-profil-img-right-label">
                                                <label htmlFor="file-avatar">Upload Profile Image:</label>
                                            </div>
                                            <div className="p-panel-p-profil-img-right-input">
                                                <input 
                                                    type="file" 
                                                    id="p-avatar" 
                                                    name="p-avatar" 
                                                    accept="image/png, image/jpeg" 
                                                    onChange={handleFileChange} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input">First Name</label>
                                    <input required className="p-panel-p-p-input" id="p-p-input" type="text" placeholder='Max' defaultValue={firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                                </div>
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input3">Last Name</label>
                                    <input required className="p-panel-p-p-input" id="p-p-input3" type="text" placeholder='Doe' defaultValue={lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                                </div>
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input4">Email</label>
                                    <input className="p-panel-p-p-input" id="p-p-input4" type="email" placeholder={email} onChange={(e) => handleInputChange("email", e.target.value)} readOnly />
                                </div>
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input5">Password</label>
                                    <input className="p-panel-p-p-input" id="p-p-input5" type="password" placeholder='****************' onChange={(e) => handleInputChange("password", e.target.value)} readOnly />
                                </div>
                            </div>
                            <div className="p-panel-person--right">
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input1">Birth Date</label>
                                    <input required className="p-panel-p-p-input p-panel-p-p-input-birthdate" id="p-p-input2" type="date" defaultValue={birthDate} onChange={(e) => handleInputChange("birthDate", e.target.value)} />
                                </div>
                                {gender ? (
                                    <div className="p-p-input-radio">
                                        <label className="gender2">Gender</label>
                                        <div className="radio-gender">
                                            <div>
                                                <input required type="radio" id="p-male" name="gender" value="Male" defaultChecked={gender === "Male"} />
                                                <label htmlFor="p-male">Male</label>
                                            </div>
                                            <div>
                                                <input required type="radio" id="p-female" name="gender" value="Female" defaultChecked={gender === "Female"} />
                                                <label htmlFor="p-female">Female</label>
                                            </div>
                                            <div>
                                                <input required type="radio" id="p-other" name="gender" value="Others" defaultChecked={gender === "Others"} />
                                                <label htmlFor="p-other">Other</label>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input6">Street</label>
                                    <input required className="p-panel-p-p-input" id="p-p-input6" type="text" placeholder='Main St' defaultValue={street} onChange={(e) => handleInputChange("street", e.target.value)} />
                                </div>
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input7">Zip Code</label>
                                    <input required className="p-panel-p-p-input" id="p-p-input7" type="number" placeholder='12345' defaultValue={zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} />
                                </div>
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input8">City</label>
                                    <input required className="p-panel-p-p-input" id="p-p-input8" type="text" placeholder='New York' defaultValue={cityName} onChange={(e) => handleInputChange("cityName", e.target.value)} />
                                </div>
                                <div className="p-p-input">
                                    <label className="p-panel-p-label" htmlFor="p-p-input10">Phone</label>
                                    <input required className="p-panel-p-p-input" id="p-p-input10" type="text" placeholder='e.g. 1554212121' defaultValue={phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="p-panel-profile-save-main-btn">
                            <button type="submit" className="p-panel-profile-save-btn">Save</button>
                        </div>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default PProfile
