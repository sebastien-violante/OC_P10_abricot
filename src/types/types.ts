export type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type AuthenticateData = {
    user: User;
    token: string;
}

export type Detail = {
    field: string;
    message: string;
}

export type Details = Detail[]

export type AuthenticateResult = {
    success: boolean;
    error?: string;
    message: string;
    data?: AuthenticateData;
    details?: Details;
}

export type FormData = {
    email: string;
    password: string;
    name?: string;
    type?: string;
}

export type FormErrors = {
    email?: string;
    password?: string;
    name?: string;
}

export type FetchErrors = string

export type FetchSuccessData = {
    data: {
        token: string;
    }
    user?: {
        email: string;
    };
};