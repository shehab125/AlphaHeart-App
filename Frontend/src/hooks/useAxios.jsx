import axios from "axios";
import { useSelector } from "react-redux";

// Update the base URL to match your backend server
const URL = "http://localhost:8000/api";

const useAxios = () => {
    const {token} = useSelector((state)=> state.auth)

    const axiosWithToken = axios.create({
        baseURL: URL,
        headers: {
            'Authorization': `Token ${token}`,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        },
        withCredentials: true
    })

    // Add request interceptor to handle file uploads
    axiosWithToken.interceptors.request.use(
        (config) => {
            // If the request contains FormData, don't set Content-Type
            // Let the browser set it with the boundary
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to log responses
    axiosWithToken.interceptors.response.use(
        (response) => {
            console.log("API Response:", response.config.url, response.status, response.data);
            return response;
        },
        (error) => {
            console.error("API Error:", error.config?.url, error.response?.status, error.response?.data);
            return Promise.reject(error);
        }
    );

    const axiosPublic = axios.create({
        baseURL: URL,
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        },
        withCredentials: true
    })

    // Add request interceptor to handle file uploads
    axiosPublic.interceptors.request.use(
        (config) => {
            // If the request contains FormData, don't set Content-Type
            // Let the browser set it with the boundary
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to log responses
    axiosPublic.interceptors.response.use(
        (response) => {
            console.log("Public API Response:", response.config.url, response.status, response.data);
            return response;
        },
        (error) => {
            console.error("Public API Error:", error.config?.url, error.response?.status, error.response?.data);
            return Promise.reject(error);
        }
    );

    return {axiosWithToken, axiosPublic}
}

export default useAxios