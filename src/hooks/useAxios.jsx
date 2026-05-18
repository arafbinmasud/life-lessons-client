import axios from "axios";

const instance = axios.create({
  baseURL: "https://life-lesson-server-kohl.vercel.app",
});

const useAxios = () => {
  return instance;
};

export default useAxios;
