import axios, { AxiosRequestConfig } from "axios";
import { logger } from "./winston";

export const clockApi = axios.create({
    baseURL: process.env.RELOGIO_API_URL || "http://localhost",
    timeout: 10000,
});

const clockRequest = async (path: string = '/', options: AxiosRequestConfig = {}, body: any = {}) => {
    try {
        const response = await clockApi.post(
            path,
            body,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                ...options
            }
        );
        return response.data;
    } catch (error) {
        logger.error("Error fetching data from clock API:", error);
        throw error;
    }
};

const session = {
    login: async (body: any = { login: "admin", password: "admin" }) => await clockRequest('/login.fcgi', {}, { ...body }),
    logout: async (session: string) => await clockRequest('/logout.fcgi', {}, { session }),
};