import React, { useState } from 'react'
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import useAuthCall from '../../hooks/useAuthCall'
import patient from '../../assets/patient.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const registerSchema = object().shape({
  firstName: string()
    .max(20, "Maximum 20 characters")
    .required("First name is required"),
  lastName: string()
    .max(20, "Maximum 20 characters")
    .required("Last name is required"),
  email: string().email().required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .max(20, "Maximum 20 characters")
    .matches(/\d+/, "Minimum 1 digit")
    .matches(/[a-z]/, "Minimum 1 lowercase letter")
    .matches(/[A-Z]/, "Minimum 1 uppercase letter")
    .matches(/[!,?{}><%&$#£+-.]+/, "Minimum 1 special character"),
  street: string()
    .required("Street is required"),
  zipCode: string()
    .required("ZIP code is required"),
})





const RegisterPatientForm = () => {


  const { regPatient } = useAuthCall()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  })

  const onSubmit = (data) => {
    
    toast.success("Registration completed successfully.");
    setTimeout(() => {
      regPatient(data)
    }, 4000);
  }

  const [isPasswordHidden, setPasswordHidden] = useState(true)
  const [isCalendarHidden, setCalendarHidden] = useState(true)

  
  return (
    <div className='register-form-page h-[90vh] md:h-[88vh] md:py-11 text-center flex flex-col items-center'>
      <div className='flex justify-center items-center mb-12 lg:mb-5'>
        <div className='flex justify-center items-center title-heading mr-3 rounded-md lg:rounded-lg p-2'>
          <img src={patient} alt="patientIcon" width={20} height={30}/>
          <h1 className='text-main-dark-blue font-bold ml-1 md:text-lg xl:text-2xl'>Patient</h1>
        </div>
        <h1 className='reg-title my-4 md:my-5 text-2xl md:text-3xl xl:text-4xl'>Registration</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='register-form mt-4 md:mt-10 xl:mt-0 flex flex-col items-center justify-center'>
      
        <div className='flex flex-col items-center xl:flex-row xl:justify-between w-full'>
          <div className="relative w-[330px] xl:min-w-[180px] sm:w-[400px] md:w-[300px] lg:w-[360px] xl:mx-1 xl:w-[300px] text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
            </svg>

            <input
              type="text"
              {...register('firstName')}
              placeholder="First Name"
              className="w-full pl-[3rem] text-main-dark-blue h-12 pr-3 py-2 appearance-none bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg"
            />
            {errors.firstName && (
            <p className="text-xs italic text-cyan-100">{errors.firstName.message}</p>
          )}
          </div>
          <div className="relative w-[330px] mt-2 xl:mt-0 xl:min-w-[180px] sm:w-[400px] md:w-[300px] lg:w-[360px] xl:w-[300px] xl:mx-1 text-main-dark-blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
            </svg>
            <input
              type="text"
              {...register('lastName')}
              placeholder="Last Name"
              className="w-full pl-[3rem] h-12 pr-3 py-2 appearance-none bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg"
            />
            {errors.lastName && (
              <p className="text-xs italic text-cyan-100">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className='flex flex-col items-center xl:flex-row xl:justify-between w-full 2xl:mt-4'>
          <div className="relative w-[330px] xl:min-w-[180px] sm:w-[400px] md:w-[300px] lg:w-[360px] xl:mx-1 xl:w-[300px] mt-2">
            <svg className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <input
                type="text"
                {...register('email')}
                placeholder="Email"
                className="w-full pl-12 h-12 pr-3 py-2 text-main-dark-blue bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg"
            />
            {errors.email && <p className="text-xs italic text-cyan-100">{errors.email.message}</p>}
          </div>
          <div className="relative w-[330px] xl:min-w-[180px] sm:w-[400px] md:w-[300px] lg:w-[360px] xl:mx-1 xl:w-[300px] mt-2">
                <button className="text-gray-400 absolute right-3 inset-y-0 my-auto active:text-main-dark-blue"
                    onClick={() => setPasswordHidden(!isPasswordHidden)}
                >
                    {
                        isPasswordHidden ? (
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>

                        )
                    }
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>

                <input
                    type={isPasswordHidden ? "password" : "text"}
                    {...register('password')}
                    placeholder="Password"
                    className="w-full pl-[3rem] pr-12 h-12 py-2 text-main-dark-blue bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg"
                />
                {errors.password && (
                  <p className="text-xs italic text-cyan-100">{errors.password.message}</p>
                )}
          </div>
        </div>  
        <div className='flex flex-col items-center xl:flex-row xl:justify-between w-full 2xl:mt-4'>
          <div className='relative w-[330px] xl:min-w-[180px] sm:w-[400px] md:w-[300px] lg:w-[360px] xl:mx-1 xl:w-[300px] mt-2 flex items-center' >
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={() => setCalendarHidden(!isCalendarHidden)} className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {
              isCalendarHidden ? 
              <input type="text" {...register('birthDate')} onClick={() => setCalendarHidden(!isCalendarHidden)} className="w-full pl-[3rem] text-main-dark-blue h-11 pr-3 py-2 appearance-none bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg" placeholder="Birthday" /> 
              : 
              <input type="date" {...register('birthDate')} className="w-full pl-[3rem] text-main-dark-blue h-11 pr-3 py-2 appearance-none bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg" placeholder="Birthday" />
            }
            
					    
          </div>
          
          <div className="relative mt-2 w-[330px] xl:min-w-[180px] sm:w-[400px] md:w-[300px] lg:w-[360px] xl:mx-1 xl:w-[300px] focus:border-indigo-600 shadow-sm rounded-lg text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>

            <select defaultValue="Gender" {...register('gender')} className="w-full pl-[3rem] h-11 px-3 py-2 text-md text-main-dark-blue bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
              <option value="Gender" disabled hidden className='text-main-dark-blue'>Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
        <fieldset className='w-[330px] sm:w-[400px] md:w-[300px] lg:w-[360px] xl:w-[500px] 2xl:min-w-[664px] border-2 py-3 px-2 mt-2 mb-10 md:mb-12 rounded-lg'>
          <legend  className='text-white'>Address</legend>
          <div className='w-[310px] sm:w-[380px] md:w-[280px] lg:w-[340px] xl:min-w-[480px] 2xl:min-w-[646px] 2xl:mt-2'>
            <div className="relative max-w-[652px] 2xl:w-[646px] xl:min-w-[420px] text-main-dark-blue w-full min-w-[200px] h-12">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute text-gray-400 left-3 inset-y-0 my-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>

            <input
              type="text"
              {...register('street')}
              placeholder="Street"
              className="w-full pl-[3rem] pr-3 py-2 appearance-none bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg"
            />
            {errors.street && (
              <p className="text-xs italic text-cyan-100">{errors.street.message}</p>
            )}
        </div>  
        <div className='flex flex-col xl:flex-row items-center justify-between w-full 2xl:mt-2'>
          <div className="relative mt-2 w-[310px] xl:min-w-[205px] sm:w-[380px] md:w-[280px] lg:w-[340px] xl:mx-1 xl:w-[285px] xl:max-w-[640px] text-main-dark-blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute text-gray-400 left-3 inset-y-0 my-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>

            <input
              type="number"
              {...register('zipCode')}
              placeholder="ZIP Code"
              className="w-full pl-[3rem] h-12 pr-3 py-2 appearance-none bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg"
            />
            {errors.zipCode && (
              <p className="text-xs italic text-cyan-100">{errors.zipCode.message}</p>
            )}
          </div>
          <div className="relative mt-2 w-[310px] xl:min-w-[205px] sm:w-[380px] md:w-[280px] lg:w-[340px] xl:mx-1 xl:w-[285px] text-main-dark-blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute text-gray-400 left-3 inset-y-0 my-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>

            <input
              type="string"
              {...register('cityName')}
              placeholder="City"
              className="w-full pl-[3rem] h-12 pr-3 py-2 appearance-none bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg text-lg"
            />
            {errors.cityName && (
            <p className="text-xs italic text-cyan-100">{errors.cityName.message}</p>
          )}
          </div>
        </div>
          </div>
          
        </fieldset>
        

        <button type='submit' className='flex justify-center register-button duration-150 mx-auto md:mt-6'>REGISTER</button>
        
      </form>
      <ToastContainer />
    </div>
    
  )
}

export default RegisterPatientForm

