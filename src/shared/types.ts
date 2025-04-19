import { PoolConnection } from "mysql2/promise";

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

export type CartItem = {
    gameId<T>(connection: PoolConnection, arg1: string, userId: <T>(connection: PoolConnection, arg1: string, userId: any, gameId: any, quantity: number) => unknown, gameId: any, quantity: number): unknown;
    userId<T>(connection: PoolConnection, arg1: string, userId: any, gameId: any, quantity: number): unknown;
    name: string;
    price: number;
    image: string;
    description: string;
    quantity: number;
};
