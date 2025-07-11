type LoginRequest = {
    login: string,
    password: string,
}

type ChangeLoginRequest = {
    email: string,
    password: string,
    confirmation: string,
};

type Company = {
    address: string
    cei: number
    cpf: number
    cpf_cnpj: number
    name: string
    tipo_doc: number
}

type RegisterUserRequest = {
    admin: boolean
    bars: string
    code: number
    name: string
    password: string
    pis: number
    registration: number
    rfid: number
    templates: any[]
}

type RegisterUserRequestWithCpf = {
    admin: boolean
    bars: string
    code: number
    name: string
    password: string
    pis: number
    registration: number
    rfid: number
    templates: any[]
}

type IdentifyUserToAction = {
    cei_or_cpf: number | string
}

type GetAFDByDateRequest = {
    initial_date: {
        day: number,
        month: number,
        year: number
    }
}

type SetSystemNetworkRequest = {
    ip: string
    netmask: string
    gateway: string
    dns: string
    use_dhcp: boolean
    port: number
}

type SetSystemDateTimeRequest = {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
    timezone?: string
}

export type {
    ChangeLoginRequest,
    Company,
    LoginRequest,
    RegisterUserRequest,
    RegisterUserRequestWithCpf,
    IdentifyUserToAction,
    GetAFDByDateRequest,
    SetSystemNetworkRequest,
    SetSystemDateTimeRequest
}