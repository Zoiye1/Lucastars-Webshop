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

/**
 * Represents the query options for getting games
 */
export type GetGamesOptions = {
    /** Page number for pagination */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Sort order for the games */
    sort?: "asc" | "desc";
    /** Sort field for the games */
    sortBy?: "name" | "price" | "created";
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

/**
 * Generic paginated response type
 */
export interface PaginatedResponse<T> {
    /** Actual data items */
    items: T[];
    /** Pagination data */
    pagination: {
        /** Total number of items across all pages */
        totalItems: number;
        /** Number of items per page */
        itemsPerPage: number;
        /** Current page number */
        currentPage: number;
        /** Total number of pages */
        totalPages: number;
    };
}
