import { CartItem } from "@shared/types";

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
}
