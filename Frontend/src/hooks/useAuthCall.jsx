import axios from "axios";
import { fetchFail, fetchStart, loginSuccess, logoutSuccess, registerSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"


const url = process.env.REACT_APP_BASE_URL

const useAuthCall = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token, userType} = useSelector(state => state.auth);

    /* -------------------------------------------------------------------------- */
    /*                               The Login Process                            */
    /* -------------------------------------------------------------------------- */

    const login = async (userData, setErrorMessage) => {  
        dispatch(fetchStart())
        try {
            const { data } = await axios.post(`${url}/api/auth/login`, userData)
            dispatch(loginSuccess(data)) 
            navigate(`/${data.userType}`)
        } catch (error) {
            dispatch(fetchFail())
            if (setErrorMessage) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message)
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.")
                }
            }
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                              The Logout Process                            */
    /* -------------------------------------------------------------------------- */
    
    const logout = async () => {  
        dispatch(fetchStart())
        try {
            await axios.post(`${url}/api/auth/logout`, null,{
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            dispatch(logoutSuccess())
            navigate("/")
        } catch (error) {
            dispatch(fetchFail())
            console.log(error);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                            The Patient Registration                        */
    /* -------------------------------------------------------------------------- */

    const regPatient = async (userData) => { 
        dispatch(fetchStart())
        try {
            const { data } = await axios.post(`${url}/api/auth/register`, userData)
            dispatch(registerSuccess(data))
            navigate("/login")
        } catch (error) {
            dispatch(fetchFail())
            console.log(error);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                            The Doctor Registration                         */
    /* -------------------------------------------------------------------------- */

    const regDoctor = async (userData) => { 
        dispatch(fetchStart())
        try {
            const { data } = await axios.post(`${url}/api/auth/register`, userData)
            dispatch(registerSuccess(data))
            navigate("/login")
        } catch (error) {
            dispatch(fetchFail())
            console.log(error);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                              Create Admin                                  */
    /* -------------------------------------------------------------------------- */
    
    const createAdmin = async (adminData) => {
        dispatch(fetchStart());
        try {
            const { data } = await axios.post(`${url}/api/admins`, adminData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            console.log("Admin created successfully:", data);
        } catch (error) {
            dispatch(fetchFail());
            console.error("Error creating admin:", error);
        }
    };


    return {
        login, logout, regPatient, regDoctor, createAdmin
    }

}
export default useAuthCall
