import React, { useEffect, useRef, useState } from 'react'
import ProcessBar from '../processBar/ProcessBar';
import useDataCall from '../../../../hooks/useDataCall';
import "./approvalForm.css"
import profilImage from "../../../../assets/profil_image2.png"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApprovalForm = (doctorProfile) => {
    const { putData, getData, postData } = useDataCall()
    const { id, avatar, doc, firstName, lastName, email, birthDate, gender, street, zipCode, cityName, title, phone, branch, languages, website, about, services } = doctorProfile
    const [count, setCount] = useState(0)
    const [file, setFile] = useState(null)
    const [secondFile, setSecondFile] = useState(null);
    const URL = process.env.REACT_APP_BASE_URL
   
    useEffect(() => {
        getData("branches")
    }, [])

    const doctorProfileRef = useRef({

        avatar: avatar || "",
        firstName: firstName || "",
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
    const fileImage = avatar ? `${URL}/uploads/${avatar}` : profilImage

    const handleInputChange = (field, value) => {
        doctorProfileRef.current = {
            ...doctorProfileRef.current,
            [field]: value
        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        handleInputChange("avatar", e.target.value)
    }

    const handleSecondFileChange = (e) => {
        setSecondFile(e.target.files[0]);
        handleInputChange("doc", e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. رفع الصورة إذا وجدت
        if (file) {
            const formData1 = new FormData();
            formData1.append('image', file);
            formData1.append('userId', id);
            const response = await postData("files", formData1);
            if (response?.data?.fileName) {
                doctorProfileRef.current.avatar = response.data.fileName;
            }
        }

        // 2. رفع الملف doc إذا وجد
        if (secondFile) {
            const formData2 = new FormData();
            formData2.append('image', secondFile);
            formData2.append('userId', id);
            const response = await postData("files", formData2);
            if (response?.data?.fileName) {
                doctorProfileRef.current.doc = response.data.fileName;
            }
        } else {
            doctorProfileRef.current.doc = doc || "";
        }

        // تنظيف أي مسار وهمي (احتياطي)
        if (doctorProfileRef.current.avatar && doctorProfileRef.current.avatar.includes('fakepath')) {
            doctorProfileRef.current.avatar = avatar || "";
        }
        if (doctorProfileRef.current.doc && doctorProfileRef.current.doc.includes('fakepath')) {
            doctorProfileRef.current.doc = doc || "";
        }

        // 3. تحديث بيانات الدكتور
        await putData("doctors", id, doctorProfileRef.current);
        toast.success("Registration successful. Thank you for your registration. We will review your documents as soon as possible and get back to you.");
    }

    return (
        <div className="dpanel-person-main">

            <div className="processbar">
                <ProcessBar count={count} />
            </div>

            <div className="dpanel-main-right">
                <div className="dpanel-main-right--content">

                    <form action="" id="uploadForm" encType="multipart/form-data" className="dpanel-person" onSubmit={handleSubmit}>
                        <div className={count === 0 ? "dpanel-person-profile" : (count === 1 ? "dpanel-person-profile2" : (count >= 2 ? "dpanel-person-profile3" : null))}>
                            <div className="dpanel-person--left">
                                <div className="p-input dpanel-main--profil-image">
                                    <div className="p-input-image">
                                        <img src={fileImage} alt="profilImage" />

                                    </div>
                                    {/* <input  className="dpanel-p-input" type="text" name='p-input1' placeholder='Profilbild hochladen' /> */}
                                    <div className="dpanel-p-profil-img">
                                        <div className="dpanel-p-profil-img-right">

                                            <div className="dpanel-p-profil-img-right-label">
                                                <label htmlFor="file-avatar">Upload profile picture:</label>
                                            </div>
                                            <div className="dpanel-p-profil-img-right-input">
                                                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={(e) => handleFileChange(e)} />
                                            </div>

                                        </div>
                                    </div>


                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input2">First Name</label> <input required className="dpanel-p-input" id="p-input2" type="text" name='p-input2' placeholder='Max' defaultValue={firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input3">Last Name</label> <input required className="dpanel-p-input" id="p-input3" type="text" name='p-input3' placeholder='Doe' defaultValue={lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input4">Email</label> <input className="dpanel-p-input" id="p-input4" type="email" placeholder={email} onChange={(e) => handleInputChange("email", e.target.value)} readOnly />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input5">Password</label> <input className="dpanel-p-input" id="p-input5" type="password" placeholder='****************' onChange={(e) => handleInputChange("password", e.target.value)} readOnly />
                                </div>


                            </div>
                            <div className="dpanel-person--right">
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input1">Birthday</label> <input required className="dpanel-p-input dpanel-p-input-birthdate" id="p-input1" type="date" name='p-input1' defaultValue={birthDate} onChange={(e) => handleInputChange("birthDate", e.target.value)} />
                                </div>
                                <div className="p-input-radio">
                                    <label className="gender2" >Gender</label>
                                    <div className="radio-gender">
                                        <div>
                                            <input required type="radio" id="männlich" name="drone" defaultValue="Male" defaultChecked={gender === "Male" ? true : false} />
                                            <label htmlFor="männlich">Male</label>
                                        </div>

                                        <div>
                                            <input required type="radio" id="weiblich" name="drone" defaultValue="Female" defaultChecked={gender === "Female" ? true : false} />
                                            <label htmlFor="weiblich">Female</label>
                                        </div>

                                        <div>
                                            <input required type="radio" id="divers" name="drone" defaultValue="Others" defaultChecked={gender === "Others" ? true : false} />
                                            <label htmlFor="divers">Others</label>
                                        </div>

                                    </div>

                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input6">Street</label> <input required className="dpanel-p-input" id="p-input6" type="text" placeholder='Long street' defaultValue={street} onChange={(e) => handleInputChange("street", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input7">ZIP Code</label> <input required className="dpanel-p-input" id="p-input7" type="number" placeholder='12345' defaultValue={zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input8">City</label> <input required className="dpanel-p-input" id="p-input8" type="text" placeholder='London' defaultValue={cityName} onChange={(e) => handleInputChange("cityName", e.target.value)} />
                                </div>

                            </div>
                            {/* style={{transform: "translateY(-70vh)"}} */}
                        </div>
                        <div className={count === 0 ? "dpanel-person-profile" : (count === 1 ? "dpanel-person-profile2" : (count >= 2 ? "dpanel-person-profile3" : null))}>
                            <div className="dpanel-person--left">
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input9">Title</label> <input required className="dpanel-p-input" id="p-input9" type="text" name='p-input9' placeholder='Dr.med' defaultValue={title} onChange={(e) => handleInputChange("title", e.target.value)}
                                    />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input10">Phone</label> <input required className="dpanel-p-input" id="p-input10" type="text" placeholder='e.g. 1554212121' defaultValue={phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input11" >Specialty</label>
                                    <input required className="dpanel-p-input" id="p-input11" type="text" placeholder='e.g. Ophthalmologist' defaultValue={branch} onChange={(e) => handleInputChange("branch", e.target.value)} />

                                    {/* <select className="dpanel-p-input" name="branches" id="branches" onChange={(e) => handleInputChange("branches", e.target.value)} style={{marginRight:"15px"}}>
                                            <option value="">Bitte wähle eine Option</option>
                                            {branches && (branches?.map((item,i)=><option key={i} value={item.name}>{item.name}</option>))}
     
                                    </select> */}
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input12">Languages</label> <input required className="dpanel-p-input" id="p-input12" type="text" placeholder='e.g. English, German' defaultValue={languages} onChange={(e) => handleInputChange("languages", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input13">Website</label> <input required className="dpanel-p-input" id="p-input13" type="text" placeholder='e.g. www.appointment.com' defaultValue={website} onChange={(e) => handleInputChange("website", e.target.value)} />
                                </div>

                            </div>
                            <div className="dpanel-person--right">
                                <div className="p-input-about">
                                    <p>About Me</p> <textarea required name="" id="d-textarea-about" cols="50" rows="10" placeholder="e.g. Healthy eyes are the visual gateway to the world - and the basis for enjoying life actively and independently. This applies to children's eyes, but especially with increasing age, increased value should be placed on good eye health..." defaultValue={about} onChange={(e) => handleInputChange("about", e.target.value)}>
                                    </textarea>

                                </div>

                            </div>
                        </div>
                        <div className={count === 0 ? "dpanel-person-profile" : (count === 1 ? "dpanel-person-profile2" : (count >= 2 ? "dpanel-person-profile3" : null))}>
                            <div className="dpanel-person--left person3">
                                <div className="p-input p-input3-1">
                                    <label className="dpanel-p-label" htmlFor="p-input14">Services</label>
                                    <textarea required name="" id="d-textarea-services" cols="50" rows="10" placeholder="e.g. Age-related macular degeneration AMD, Eye pain, Diabetic retinopathy, Glaucoma, Myopia, Cataract, Laser for after-cataract" defaultValue={services} onChange={(e) => handleInputChange("services", e.target.value)}>
                                    </textarea>
                                </div>
                                <div className="p-input p-input3-2">
                                    <div className="dpanel-p-profil-data-upload-left">
                                        <label className="dpanel-p-label" htmlFor="p-input15">Files</label>
                                    </div>

                                    <div className="dpanel-p-profil-data-upload-right">
                                        <div className="dpanel-p-profil-data-upload-right-label">
                                            <label htmlFor="avatar">Please upload medical files in PDF format only:</label>
                                        </div>
                                        <div className="dpanel-p-profil-data-upload-right-input">

                                            <input type="file" id="branchFile" name="branchFile" multiple accept=".pdf" onChange={(e) => handleSecondFileChange(e)} />
                                        </div>

                                    </div>
                                </div>
                                <button type="submit" className="dpanel-profile-save-btn" >Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


            <div className="dpanel-main-btn">
                {/* <button className= {count > 0 ? "dpanel-main-btn--left" : "dpanel-main-btn--left2"} onClick={()=>setCount(count-1)}>Vorherige Schritt</button>  */}
                {count === 3 ? (<button className="dpanel-main-btn--left" onClick={() => setCount(count - 3)}>Back</button>) :
                    <button className="dpanel-main-btn--left" style={{ visibility: (count > 0 || count === 2) ? "visible" : "hidden" }} onClick={() => setCount(count - 1)}>Previous Step</button>}
                {count < 2 ? <button className="dpanel-main-btn--right" onClick={() => setCount(count + 1)}>Next Step</button>
                    : <button className="dpanel-main-btn--right" onClick={() => setCount(count + 1)} style={{ visibility: count === 3 ? "hidden" : "hidden" }}>Submit</button>}
                
            </div>
            <ToastContainer />
        </div>

    )
}

export default ApprovalForm