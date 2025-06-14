import React, { useEffect, useRef, useState } from 'react'
import useDataCall from '../../../../hooks/useDataCall';
import "./dProfile.css"
import profilImage from "../../../../assets/profil_image2.png"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { putSuccess, updateProfileImage } from '../../../../features/authSlice';

const DProfile = (doctorProfile) => {
    const { putData, postData } = useDataCall()
    const dispatch = useDispatch();
    const { id, avatar, firstName, lastName, email, birthDate, gender, street, zipCode, cityName, title, phone, branch, languages, website, about, services, doc } = doctorProfile
    const [file, setFile] = useState(null)
    const [secondFile, setSecondFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null) // إضافة state لمعاينة الصورة
    const URL = process.env.REACT_APP_BASE_URL

    // إضافة timestamp لتجنب cache
    let fileImage = profilImage
    if(avatar) {
        fileImage = `${URL}/uploads/${avatar}?t=${Date.now()}`
    }

    const doctorProfileRef = useRef({
        avatar: avatar || "",
        firstName: firstName,
        lastName: lastName || "",
        birthDate: birthDate || "",
        street: street || "",
        zipCode: zipCode || "",
        cityName: cityName || "",
        title: title || "",
        phone: phone || "",
        branch: branch || "",
        languages: languages || "",
        website: website || "",
        about: about || "",
        services: services || "",
        doc: doc || "",
    })

    const handleInputChange = (field, value) => {
        doctorProfileRef.current = {
            ...doctorProfileRef.current,
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
        }
    }

    const handleSecondFileChange = (e) => {
        setSecondFile(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Upload profile image if exists
            if (file) {
                const formData1 = new FormData();
                formData1.append('image', file);
                formData1.append('userId', id);
                formData1.append('userType', 'doctor');
                
                console.log('Uploading profile image:', file);
                const response = await postData("files", formData1);
                console.log('Profile image upload response:', response);
                
                if (response?.data?.fileName) {
                    // Update image in Redux state
                dispatch(updateProfileImage({ 
                        avatar: response.data.fileName
                }));
                
                    // Update image in object
                    doctorProfileRef.current.avatar = response.data.fileName;
                
                    // Reset image preview
                setImagePreview(null);
                setFile(null);
                }
            } else {
                doctorProfileRef.current.avatar = avatar || "";
            }

            // 2. Upload doc file if exists
            if (secondFile) {
                const formData2 = new FormData();
                formData2.append('image', secondFile);
                formData2.append('userId', id);
                formData2.append('userType', 'doctor');
                
                console.log('Uploading doc file:', secondFile);
                const response = await postData("files", formData2);
                console.log('Doc file upload response:', response);
                
                if (response?.data?.fileName) {
                    doctorProfileRef.current.doc = response.data.fileName;
                }
            } else {
                doctorProfileRef.current.doc = doc || "";
            }

            // Clean up any fake paths
            if (doctorProfileRef.current.avatar && doctorProfileRef.current.avatar.includes('fakepath')) {
                doctorProfileRef.current.avatar = avatar || "";
            }
            if (doctorProfileRef.current.doc && doctorProfileRef.current.doc.includes('fakepath')) {
                doctorProfileRef.current.doc = doc || "";
            }

            console.log('Updating doctor profile with:', doctorProfileRef.current);
            
            // 3. Update doctor profile
            const updateResponse = await putData("doctors", id, doctorProfileRef.current);
            console.log('Profile update response:', updateResponse);
            
            toast.success("Profile updated successfully!");

            // Reload page after 1 second if new image was uploaded
            if (file) {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || "Error updating profile");
        }
    }

    return (
        <div className="main-content d-profile-panel-person-main">
            <div className="d-profile-panel-main-right">
                <div className="d-profile-panel-main-right--content">
                    <form action="" id="dr-uploadForm" encType="multipart/form-data" className="d-profile-panel-person " onSubmit={handleSubmit}>
                        <div className="d-profile-panel-person-profile mt-10 d-flex ">
                            <div className="d-profile-panel-person--left">
                                <div className="d-p-input d-profile-panel-main--profil-image">
                                    <div className="d-p-input-image">
                                        <img 
                                            src={imagePreview || fileImage} 
                                            alt="profilImage" 
                                            onError={(e) => {
                                                e.target.src = profilImage;
                                            }}
                                        />
                                    </div>
                                    <div className="d-profile-panel-p-profil-img">
                                        <div className="d-profile-panel-p-profil-img-right">
                                            <div className="d-profile-panel-p-profil-img-right-label">
                                                <label htmlFor="file-avatar">Upload profile picture:</label>
                                            </div>
                                            <div className="d-profile-panel-p-profil-img-right-input">
                                                <input 
                                                    type="file" 
                                                    id="dr-avatar" 
                                                    name="dr-avatar" 
                                                    accept="image/png, image/jpeg"
                                                    onChange={handleFileChange} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-p-input">
                                    <label className="d-profile-panel-p-label" htmlFor="dr-p-input">First Name</label> <input required className="d-profile-panel-d-p-input" id="dr-p-input" type="text" placeholder='Max' defaultValue={firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                                </div>
                                <div className="d-p-input">
                                    <label className="d-profile-panel-p-label" htmlFor="dr-p-input3">Last Name</label> <input required className="d-profile-panel-d-p-input" id="dr-p-input3" type="text" placeholder='Doe' defaultValue={lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                                </div>
                                <div className="d-p-input">
                                    <label className="d-profile-panel-p-label" htmlFor="dr-p-input4">Email</label> <input className="d-profile-panel-d-p-input" id="dr-p-input4" type="email" placeholder={email} onChange={(e) => handleInputChange("email", e.target.value)} readOnly />
                                </div>
                                <div className="d-p-input">
                                    <label className="d-profile-panel-p-label" htmlFor="dr-p-input5">Password</label> <input className="d-profile-panel-d-p-input" id="dr-p-input5" type="password" placeholder='****************' onChange={(e) => handleInputChange("password", e.target.value)} readOnly />
                                </div>
                            </div>
                            <div className="d-profile-panel-person--right">
                                <div className="p-input-about">
                                    <p>About Me</p> <textarea required name="" id="dr-textarea-about" cols="42" rows="10" placeholder=" e.g. Healthy eyes are the visual gateway to the world - and the basis for enjoying life actively and independently. This applies to children's eyes, but especially with increasing age, increased value should be placed on good eye health..." defaultValue={about} onChange={(e) => handleInputChange("about", e.target.value)}>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="d-profile-panel-person-profile3">
                            <div className="d-profile-panel-person--left person3">
                                <div className="p-input p-input3-1">
                                    <label className="d-profile-panel-p-label" htmlFor="p-input14">Services</label>
                                    <textarea required name="" id="dr-textarea-complaints" cols="50" rows="10" placeholder="e.g. Age-related macular degeneration AMD, Eye pain, Diabetic retinopathy, Glaucoma, Myopia, Cataract, Laser for after-cataract" defaultValue={services} onChange={(e) => handleInputChange("services", e.target.value)}>
                                    </textarea>
                                </div>
                                <div className="p-input p-input3-2">
                                    <div className="dpanel-p-profil-data-upload-left">
                                        <label className="dpanel-p-label" htmlFor="p-input15">Files</label>
                                    </div>
                                    <div className="dpanel-p-profil-data-upload-right">
                                        <div className="dpanel-p-profil-data-upload-right-label">
                                            <label htmlFor="avatar">Upload your medical documents:</label>
                                        </div>
                                        <div className="dpanel-p-profil-data-upload-right-input">
                                            <input type="file" id="branchFile2" name="branchFile2" accept="image/png, image/jpeg" onChange={handleSecondFileChange}/>
                                        </div>
                                    </div>
                                </div>  
                                <button type="submit" className="d-profile-panel-profile-save-btn" >Save</button>
                            </div>
                        </div>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default DProfile

