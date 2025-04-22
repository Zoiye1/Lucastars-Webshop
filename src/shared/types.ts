/**
 * Represents a session
 */
export type SessionResponse = {
    /** ID of the session */
    sessionId: string;
};

/**
 * Represents a welcome message
 */
export type WelcomeResponse = {
    /** Contents of the welcome message */
    message: string;
};

/**
 * Represents a secret message
 */
export type SecretResponse = {
    /** ID of the session */
    sessionId: string;
    /** ID of the user */
    userId: string;
};

export interface IUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    prefix: string | null;
    lastName: string;
    password: string;
    created: Date;
    updated: Date;
}

export interface IUserRegisterDTO {
    username: string;
    email: string;
    firstName: string;
    prefix?: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

export interface IAuthResponse {
    success: boolean;
    message: string;
    sessionId?: string;
}

export type AuthReponse = {
    success: boolean;
    message: string;
    sessionId?: string;
};
