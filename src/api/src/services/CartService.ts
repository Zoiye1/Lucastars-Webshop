import { ICartService } from "@api/interfaces/ICartService";
import { CartItem } from "@shared/types";

export class CartService implements ICartService {
    private carts: Map<number, CartItem[]> = new Map([
        [1, [
            {
                name: "T-shirt",
                price: 19.99,
                image: "https://example.com/images/tshirt.jpg",
                description: "Comfortabel katoenen T-shirt in verschillende maten.",
                quantity: 2,
            },
            {
                name: "Cap",
                price: 9.99,
                image: "https://example.com/images/cap.jpg",
                description: "Stijlvolle pet, perfect voor zonnige dagen.",
                quantity: 1,
            },
        ]],
    ]);

    public getCart(userId: number): CartItem[] {
        return this.carts.get(userId) ?? [];
    }

    public updateCart(userId: number, items: CartItem[]): void {
        this.carts.set(userId, items);
    }
}
