import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateAdminRouter = () => {
  const { userType, token } = useSelector((state) => state.auth) 
  return userType === "admin" && token ? <Outlet/> : <Navigate to="/"/>
};

export const PrivateDoctorRouter = () => {
  const { userType, token } = useSelector((state) => state.auth) 
  return userType === "doctor" && token ? <Outlet/> : <Navigate to="/"/>
};

export const PrivatePatientRouter = () => {
  const { userType, token } = useSelector((state) => state.auth) 
  return userType === "patient" && token ? <Outlet/> : <Navigate to="/"/>
};

