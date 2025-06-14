import { fetchFail, fetchStart, getDataSuccess, putSuccess } from '../features/dataSlice';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from './useAxios';
import { toast } from "react-hot-toast";

// Cache for storing API responses
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds cache duration

// Throttle function to limit API calls
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const useDataCall = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();
  const { userId } = useSelector((state) => state.auth);

  const getData = async (url) => {
    // Check cache first
    const cacheKey = `get_${url}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`/${url}`);
      // Update cache
      cache.set(cacheKey, { data, timestamp: Date.now() });
      dispatch(getDataSuccess({ data, url }));
      return data;
    } catch (error) {
      console.error(`Error in GET /${url}:`, error.response?.data || error.message);
      dispatch(fetchFail(error.message));
      toast.error(error.message);
      throw error;
    }
  };

  const getSingleData = async (url, userId) => {
    if (!userId) return null;
    
    // Check cache first
    const cacheKey = `get_single_${url}_${userId}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`/${url}/${userId}`);
      // Update cache
      cache.set(cacheKey, { data, timestamp: Date.now() });
      
      // Only dispatch if we have valid data
      if (data) {
        const payload = {
          data: data?.data || data,
          url: url
        };
        dispatch(getDataSuccess(payload));
      }
      
      return data;
    } catch (error) {
      console.error(`Error in GET /${url}/${userId}:`, error.response?.status, error.response?.data);
      dispatch(fetchFail(error.message));
      toast.error(error.message);
      throw error;
    }
  };

  // Throttle the API calls
  const throttledGetData = throttle(getData, 1000); // 1 second throttle
  const throttledGetSingleData = throttle(getSingleData, 1000); // 1 second throttle

  return { 
    getData: throttledGetData, 
    getSingleData: throttledGetSingleData,
    postData: async (url, data) => {
      dispatch(fetchStart());
      try {
        const response = await axiosWithToken.post(`/${url}`, data);
        // Clear relevant cache entries
        cache.delete(`get_${url}`);
        dispatch(getDataSuccess(response.data));
        toast.success("تمت الإضافة بنجاح");
        return response;
      } catch (error) {
        console.error('Error in POST', url, error.response?.data || error.message);
        dispatch(fetchFail(error.message));
        toast.error(error.message);
        throw error;
      }
    },
    putData: async (url, id, data) => {
      dispatch(fetchStart());
      try {
        const response = await axiosWithToken.put(`/${url}/${id}`, data);
        // هذا الجزء يضمن تحديث Redux store بعد عملية التحديث
        if (url === "events" || url === "appointments" || url==="tasks" || url==="notes") {
               await getSingleData(url, userId);
        } else {
          await getData(url);
        }

        if(url==="doctors" || url==="patients" || url==="admins") {
          dispatch(putSuccess({info: data})); // تأكد من أن info هنا هي data التي تم إرسالها
        }

        dispatch(putSuccess(response.data));
        toast.success("تم التحديث بنجاح");
        return response;
      } catch (error) {
        console.error('Error in PUT', url, error.response?.data || error.message);
        dispatch(fetchFail(error.message));
        toast.error(error.message);
        throw error;
      }
    },
    delData: async (url, id) => {
      dispatch(fetchStart());
      try {
        await axiosWithToken.delete(`/${url}/${id}`);
        // Clear relevant cache entries
        // هذا الجزء يضمن تحديث Redux store بعد عملية الحذف
        if(url==="tasks" || url==="notes" || url === "events" || url === "appointments") {
          await getSingleData(url, userId);
        } else {
          await getData(url);
        }

        // Only refetch if we have an ID
        if (id) {
          if(url==="tasks" || url==="notes" || url === "events" || url === "appointments") {
            await getSingleData(url, id);
          } else {
            await getData(url);
          }
        }

        dispatch(getDataSuccess(null));
        toast.success("تم الحذف بنجاح");
      } catch (error) {
        console.error(`Error in DELETE /${url}/${id}:`, error.response?.status, error.response?.data);
        dispatch(fetchFail(error.message));
        toast.error(error.message);
        throw error;
      }
    }
  };
};

export default useDataCall;