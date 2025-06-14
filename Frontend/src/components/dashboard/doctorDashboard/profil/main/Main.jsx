import React, { useEffect, useRef, useState } from 'react'
import useDataCall from '../../../../../hooks/useDataCall';
import ProcessBar from '../processBar/ProcessBar';
import "./main.css"
import profilImage from "../../../../../assets/profil_image2.png"
import successImg from "../../../../../assets/success.png"
import { useSelector } from 'react-redux';
import axios from 'axios';


const Main = (doctorProfile) => {
    const { putData, getData, postData } = useDataCall()
    const { branches, files } = useSelector((state) => state.data)
    const { id, avatar, doc, firstName, lastName, email, birthDate, gender, street, zipCode, cityName, title, phone, branch, languages, website, about, services } = doctorProfile
    const [count, setCount] = useState(0)
    const [file, setFile] = useState(null)
    const [secondFile, setSecondFile] = useState(null);
    const URL = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        getData("branches").then(() => getData("files"))
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
     

    const fileImage = profilImage

    const handleInputChange = (field, value) => {
        doctorProfileRef.current = {
            ...doctorProfileRef.current,
            [field]: value
        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
                
            const response = await postData("files", formData1);
            if (response?.data?.fileName) {
                doctorProfileRef.current.avatar = response.data.fileName;
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
                
            const response = await postData("files", formData2);
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

            // Log for debugging
            console.log("Final profile data before PUT:", doctorProfileRef.current);

            // 3. Update doctor profile
            const updateResponse = await putData("doctors", id, doctorProfileRef.current);
            console.log("Profile update response:", updateResponse);

        } catch (error) {
            console.error("Error updating profile:", error);
            // You might want to show an error message to the user here
        }
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
                                                <label htmlFor="file-avatar">Profilbild hochladen:</label>
                                            </div>
                                            <div className="dpanel-p-profil-img-right-input">
                                                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={handleFileChange} />
                                            </div>

                                        </div>
                                    </div>


                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input2">Vorname</label> <input required className="dpanel-p-input" id="p-input2" type="text" name='p-input2' placeholder='Max' defaultValue={firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input3">Nachname</label> <input required className="dpanel-p-input" id="p-input3" type="text" placeholder='Doe' defaultValue={lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
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
                                            <input required type="radio" id="male" name="drone" defaultValue="male" defaultChecked={gender === "Male" ? true : false} />
                                            <label htmlFor="male">Male</label>
                                        </div>

                                        <div>
                                            <input required type="radio" id="female" name="drone" defaultValue="female" defaultChecked={gender === "Female" ? true : false} />
                                            <label htmlFor="female">Female</label>
                                        </div>

                                        <div>
                                            <input required type="radio" id="other" name="drone" defaultValue="other" defaultChecked={gender === "Others" ? true : false} />
                                            <label htmlFor="other">Other</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input6">Straße</label> <input required className="dpanel-p-input" id="p-input6" type="text" placeholder='Lange str' defaultValue={street} onChange={(e) => handleInputChange("street", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input7">Postleizahl</label> <input required className="dpanel-p-input" id="p-input7" type="number" placeholder='43226' defaultValue={zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input8">Ort</label> <input required className="dpanel-p-input" id="p-input8" type="text" placeholder='München' defaultValue={cityName} onChange={(e) => handleInputChange("cityName", e.target.value)} />
                                </div>

                            </div>
                            {/* style={{transform: "translateY(-70vh)"}} */}
                        </div>
                        <div className={count === 0 ? "dpanel-person-profile" : (count === 1 ? "dpanel-person-profile2" : (count >= 2 ? "dpanel-person-profile3" : null))}>
                            <div className="dpanel-person--left">
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input9">Titel</label> <input required className="dpanel-p-input" id="p-input9" type="text" name='p-input1' placeholder='Dr.med' defaultValue={title} onChange={(e) => handleInputChange("title", e.target.value)}
                                    />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input10">Telefon</label> <input required className="dpanel-p-input" id="p-input10" type="text" placeholder='z.B. 1554212121' defaultValue={phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input11" >Fachgebiet</label>
                                    <input required className="dpanel-p-input" id="p-input11" type="text" placeholder='z.B. Augenarzt' defaultValue={branch} onChange={(e) => handleInputChange("branch", e.target.value)} />

                                    {/* <select className="dpanel-p-input" name="branches" id="branches" onChange={(e) => handleInputChange("branches", e.target.value)} style={{marginRight:"15px"}}>
                                            <option value="">Bitte wähle eine Option</option>
                                            {branches && (branches?.map((item,i)=><option key={i} value={item.name}>{item.name}</option>))}
     
                                    </select> */}
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input12">Sprache</label> <input required className="dpanel-p-input" id="p-input12" type="text" placeholder='z.B. Deutsch, Englisch' defaultValue={languages} onChange={(e) => handleInputChange("languages", e.target.value)} />
                                </div>
                                <div className="p-input">
                                    <label className="dpanel-p-label" htmlFor="p-input13">Webseite</label> <input required className="dpanel-p-input" id="p-input13" type="text" placeholder='z.B. www.AlphaHeart.com' defaultValue={website} onChange={(e) => handleInputChange("website", e.target.value)} />
                                </div>

                            </div>
                            <div className="dpanel-person--right">
                                <div className="p-input-about">
                                    <p>About Me</p> <textarea required name="" id="textarea-about" cols="50" rows="10" placeholder=" e.g. Healthy eyes are the visual gateway to the world - and the basis for enjoying life actively and independently. This applies to children's eyes, but especially with increasing age, increased value should be placed on good eye health..." defaultValue={about} onChange={(e) => handleInputChange("about", e.target.value)}>
                                    </textarea>
                                    {/* <button>Speichern</button> */}
                                    {/* <button type="submit" className="input-btn" >Senden</button> */}
                                </div>

                            </div>
                        </div>
                        <div className={count === 0 ? "dpanel-person-profile" : (count === 1 ? "dpanel-person-profile2" : (count >= 2 ? "dpanel-person-profile3" : null))}>
                            <div className="dpanel-person--left person3">
                                <div className="p-input p-input3-1">
                                    <label className="dpanel-p-label" htmlFor="p-input14">Services</label>
                                    <textarea required name="" id="textarea-services" cols="50" rows="10" placeholder="e.g. Age-related macular degeneration AMD, Eye pain, Diabetic retinopathy, Glaucoma, Myopia, Cataract, Laser for after-cataract" defaultValue={services} onChange={(e) => handleInputChange("services", e.target.value)}>
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
                                            <input type="file" id="branchFile" name="branchFile" multiple accept="image/png, image/jpeg" onChange={handleSecondFileChange} />
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
                {count < 2 ? <button className="dpanel-main-btn--right next-btn" onClick={() => setCount(count + 1)}>Next Step</button>
                    : <button className="dpanel-main-btn--right" onClick={() => setCount(count + 1)} style={{ visibility: count === 3 ? "hidden" : "visible" }}>Submit</button>}
                {count === 3 ?
                    <div className="main-content-success">
                        <div className="main-content-success-text">
                            <img src={successImg} alt="" />
                            <p>Registration successful. Thank you for your registration. We will review your documents as soon as possible and get back to you.</p>
                        </div>
                        <div className="main-content-success-text2"></div>
                    </div>
                    : null}
            </div>

        </div>

    )
}

export default Main