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
    image: string;
    name: string;
    description: string;
    price: number;
};
