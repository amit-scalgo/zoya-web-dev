import axios from "axios";

export const basicRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const newRequest = axios.create({
  // withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const newFormRequest = axios.create({
  // withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const addAuthorizationInterceptor = (request) => {
  request.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
};

addAuthorizationInterceptor(newRequest);
addAuthorizationInterceptor(newFormRequest);
