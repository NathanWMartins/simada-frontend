import axios from "axios";
import { getToken } from "../contexts/UserContext";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
console.log("API BASE", apiBaseUrl);
export const api = axios.create({ baseURL: apiBaseUrl });

// Request interceptor → anexa Authorization: Bearer (exceto rotas públicas)
api.interceptors.request.use((config) => {
    const rawUrl = config.url ?? "";
    const path = rawUrl.startsWith("http")
        ? new URL(rawUrl).pathname
        : rawUrl;

    //rotas públicas
    const isPublic =
        path.startsWith("/coach-login") ||
        path.startsWith("/coach-register") ||
        path.startsWith("/athlete-login");
    if (!isPublic) {
        const token = getToken();
        if (token) {
            config.headers = config.headers ?? {};
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    } else {
        if (config.headers) {
            delete (config.headers as any).Authorization;
        }
    }

    return config;
});

// Response interceptor → se 401 ou 403, limpa auth e redireciona
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("auth");
            window.location.assign("/");
        }
        return Promise.reject(error);
    }
);