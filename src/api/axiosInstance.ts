// // src/api/axiosInstance.ts
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
//   withCredentials: true, // for cookies if needed
//   timeout: 10000,
// });

// // Add request interceptor
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Add response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle global errors
//     if (error.response?.status === 401) {
//       console.error("Unauthorized - maybe token expired");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

export default "yet to implement";
