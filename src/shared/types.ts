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
    street: string | null;
    houseNumber: string | null;
    postalCode: string | null;
    city: string | null;
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
 * Represents the query options for pagination
 */
export type PaginationOptions = {
    /** Page number for pagination */
    page: number;
    /** Number of items per page */
    limit: number;
};

export type PaginationSortOptions = {
    /** Sort order for the games */
    sort?: "asc" | "desc";
    /** Sort field for the games */
    sortBy?: string;
};

/**
 * Represents the query options for getting games
 */
export type GetGamesOptions = PaginationOptions & PaginationSortOptions & {
    /** Filter for tags */
    tags?: number[];
    /** Minimum price for filtering */
    minPrice?: number;
    /** Maximum price for filtering */
    maxPrice?: number;
};

/**
 * Represents the query options for getting orders
 */
export type GetOrdersOptions = PaginationOptions & PaginationSortOptions;

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
    id: number;
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
    /** List of tags associated with the game */
    tags: string[];
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

export type Order = {
    id: number;
    user: IUser;
    items: OrdersGames[];
    orderDate: Date;
    status: string;
    totalAmount: number;
    transactionId: string | null;
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
    role: string | null;
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
    user: IUser | null;
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

/**
 * Represents a tag
 */
export type Tag = {
    /** ID of the tag */
    id: number;
    /** Name of the tag */
    value: string;
};

export type UserSession = {
    /** ID of the user */
    userId: number;
    /** Role of the user */
    userRole?: string;
};
