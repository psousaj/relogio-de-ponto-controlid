import axios, { AxiosRequestConfig } from "axios";
import { logger } from "./winston";
import {
    ChangeLoginRequest,
    Company,
    GetAFDByDateRequest,
    IdentifyUserToAction,
    LoginRequest,
    RegisterUserRequest,
    RegisterUserRequestWithCpf,
    SetSystemDateTimeRequest,
    SetSystemNetworkRequest
} from "../types";

const clockApi = axios.create({
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

const sessionController = {
    login: async (body: LoginRequest = { login: "admin", password: "admin" }) => await clockRequest('/login.fcgi', {}, { ...body }),
    logout: async (session: string) => await clockRequest('/logout.fcgi', {}, { session }),
    checkSession: async (session: string) => await clockRequest('/session_is_valid.fcgi', {}, { session }),
    changeLogin: async (session: string, body: ChangeLoginRequest) => await clockRequest('/change_login.fcgi', {}, { session, ...body })
};

const employerController = {
    registerAndEditEmployer: async (session: string, body: Company) => await clockRequest('/edit_company.fcgi', {}, { session, company: { ...body } }),
    listEmployers: async (session: string) => await clockRequest('/load_company.fcgi', {}, { session }),
};

const usersController = {
    registerUser: async (session: string, users: RegisterUserRequest[]) => await clockRequest('/add_user.fcgi', {}, { session, users }),
    registerUserWithCpf: async (session: string, users: RegisterUserRequestWithCpf[]) => await clockRequest('/add_users.fcgi', { params: { mode: 671 } }, { session, users }),
    editUser: async (session: string, users: RegisterUserRequest[]) => await clockRequest('/update_users.fcgi', {}, { session, users }),
    editUserWithCpf: async (session: string, users: RegisterUserRequestWithCpf[]) => await clockRequest('/update_users.fcgi', { params: { mode: 671 } }, { session, users }),
    listUsers: async (session: string) => await clockRequest('/load_users.fcgi', {}, { session }),
    listUsersWithCpf: async (session: string) => await clockRequest('/load_users.fcgi', { params: { mode: 671 } }, { session }),
    deleteUser: async (session: string, users: IdentifyUserToAction[]) => await clockRequest('/remove_users.fcgi', {}, { session, users }),
    countUsers: async (session: string) => await clockRequest('/count_users.fcgi', {}, { session }),
    exportUsers: async (session: string) => await clockRequest('/export_users_csv.fcgi', {}, { session }),
    removeAdmins: async (session: string) => await clockRequest('/remove_admins.fcgi', {}, { session }),
}

const afdController = {
    getAFDByCpf: async (session: string) => await clockRequest('/get_afd.fcgi', { params: { mode: 671 } }, { session }),
    getAFDByCpfAndDate: async (session: string, date: GetAFDByDateRequest) => await clockRequest('/get_afd.fcgi', { params: { mode: 671 } }, { session, ...date }),
    getAFDByCpfAndNSR: async (session: string, initial_nsr: number) => await clockRequest('/get_afd.fcgi', { params: { mode: 671 } }, { session, initial_nsr }),
    getAFDByPis: async (session: string) => await clockRequest('/get_afd.fcgi', {}, { session }),
    getAFDByPisAndDate: async (session: string, date: GetAFDByDateRequest) => await clockRequest('/get_afd.fcgi', {}, { session, ...date }),
    getAFDByPisAndNSR: async (session: string, initial_nsr: number) => await clockRequest('/get_afd.fcgi', {}, { session, initial_nsr })
}

const settingsController = {
    getSystemNetwork: async (session: string) => await clockRequest('/get_system_network.fcgi', {}, { session }),
    getSystemDateTime: async (session: string) => await clockRequest('/get_system_datetime.fcgi', { params: { mode: 671 } }, { session }),
    getBobinaSize: async (session: string) => await clockRequest('/get_coil_paper.fcgi', {}, { session }),
    getSystemConfiguration: async (session: string) => await clockRequest('/get_system_configuration.fcgi', {}, { session }),
    getUsersInfo: async (session: string) => await clockRequest('/get_info.fcgi', {}, { session }),
    getSystemInformation: async (session: string) => await clockRequest('/get_system_information.fcgi', {}, { session }),
    getRepInformation: async (session: string) => await clockRequest('/get_about.fcgi', {}, { session }),
    setSystemNetwork: async (session: string, body: SetSystemNetworkRequest) => await clockRequest('/set_system_network.fcgi', {}, { session, ...body }),
    setSystemDateTime: async (
        session: string,
        body: SetSystemDateTimeRequest
    ) => {
        const finalBody = { ...body, timezone: "-0300", };
        return await clockRequest('/set_system_date_time.fcgi', { params: { mode: 671 } }, { session, ...finalBody });
    },
    setAnimationScreen: async (session: string, enabled: boolean) => await clockRequest('/set_animation_screen.fcgi', {}, { session, enabled }),
    setBuzzerBeep: async (session: string, enabled: boolean) => await clockRequest('/set_buzzer_beep.fcgi', {}, { session, enabled }),
}

export {
    settingsController,
    employerController,
    sessionController,
    usersController,
    afdController,
};