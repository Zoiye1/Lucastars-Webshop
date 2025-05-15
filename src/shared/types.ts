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
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    totalPrice: number;
};

export type CartItem = {
    userId: number;
    gameId: number;
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

/**
 * Represents a list of games
 */
export type CartResponse = {
    /** List of games */
    cart: Cart[];
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

/**
 * Represents a game product
 */
export type Cart = {
    id: number;
    userId: number;
    gameId: number;
    quantity: number;
};

export type OrdersGamesResponse = {
    /** List of games */
    ordersGames: OrdersGames[];
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
    street: string | null;
    houseNumber: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
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

export interface ICartData {
    id: number;
    userId: number;
    gameId: number;
    quantity: number;
}

export interface IAuthResponse {
    success: boolean;
    message: string;
    sessionId?: string;
}

export interface ICartResponse {
    success: boolean;
}

export type AuthReponse = {
    success: boolean;
    message: string;
    sessionId?: string;
};

export type AuthVerifyResponse = {
    loggedIn: boolean;
};
