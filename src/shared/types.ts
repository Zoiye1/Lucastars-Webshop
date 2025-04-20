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
    orderId: number;
};
