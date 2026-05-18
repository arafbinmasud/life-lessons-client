import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const axiosInstance = axios.create({
  baseURL: "https://life-lesson-server-kohl.vercel.app",
});

const useAxiosSecure = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // interceptor request
    const reqInterceptor = axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user?.accessToken}`;
      return config;
    });

    // interceptor response
    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        const statusCode = err.status;
        if (statusCode === 401 || statusCode === 403) {
          logoutUser();
          navigate("/authentication/login");
        }
        return Promise.reject(err);
      },
    );
    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [user, logoutUser, navigate]);
  return axiosInstance;
};

export default useAxiosSecure;
