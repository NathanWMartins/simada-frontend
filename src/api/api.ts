import axios from "axios";
import { getToken } from "../contexts/UserContext";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

export const api = axios.create({
    baseURL: apiBaseUrl,
});

// Request interceptor → anexa Authorization: Bearer
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor → se 401, redireciona para login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("auth");
            window.location.assign("/");
        }
        return Promise.reject(error);
    }
);