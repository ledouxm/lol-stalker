import { isDev } from "@pastable/utils";
import axios from "axios";

const baseURL = isDev() ? "http://localhost:8080" : `https://stalker.back.chainbreak.dev`;

export const api = axios.create({ baseURL });
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token has expired, force a full page refresh
        if (error.response?.status === 401) {
            // document.location.reload();
        }
        throw error;
    }
);
