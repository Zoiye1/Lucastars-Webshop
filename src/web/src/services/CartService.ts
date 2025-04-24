import { Cart, CartItem, CartResponse } from "@shared/types";

export class CartService {
    public async getCart(): Promise<CartItem[]> {
        const res: Response = await fetch(`${VITE_API_URL}cart`, { credentials: "include" });
        return await res.json() as unknown as CartItem[];
    }

    public async updateCart(items: CartItem[]): Promise<void> {
        await fetch(`${VITE_API_URL}cart`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(items),
        });
    }

    public async createCart(data: CartItem): Promise<Cart[]> {
        const url: string = `${VITE_API_URL}create-cart`;
        const response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include", // Include cookies for session
        });

        const cartResponse: CartResponse = await response.json();
        return cartResponse.cart;
    }
}
