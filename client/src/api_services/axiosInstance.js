import axios from "axios";

const URL = process.env.REACT_APP_SERVER_URL
axios.defaults.withCredentials = true;


const axiosInstance = axios.create({
  baseURL: `${URL}/api`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// const getToken = () => {
//   return localStorage.getItem("authToken");
// };

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response || error.message);
    return Promise.reject(error);
  }
);


// Intercepteurs pour gérer les erreurs ou ajouter des tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
