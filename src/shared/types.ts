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

export type CheckoutItem = {
    userId: number;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    totalPrice: number;
};

export type CartItem = {
    userId: number;
    gameid: number;
    quantity: number;
    thumbnail: string;
    name: string;
    description: string;
    price: number;
};
/**
 * Represents a list of games
 */
export type GamesResponse = {
    /** List of games */
    games: Game[];
};

export type OrdersGamesResponse = {
    /** List of games */
    ordersGames: OrdersGames[];
};

/**
 * Represents a game product
 */
export type Game = {
    /** ID of the game */
    id: string;
    /** SKU (stock keeping unit) of the game */
    sku: string;
    /** Name of the game */
    name: string;
    /** Thumbnail image url of the game */
    thumbnail: string;
    /** Description of the game with HTML formatting */
    description: string;
    /** Price of the game */
    price: number;
    /** List of images of the game */
    images: string[];
    /**
     * URL of the game
     * @remarks This will only be filled if the user owns the game
     */
    url?: string;
};

export type OrdersGames = {
    gameId: number;
    userId: number;
    name: string;
    thumbnail: string;
    price: number;
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
