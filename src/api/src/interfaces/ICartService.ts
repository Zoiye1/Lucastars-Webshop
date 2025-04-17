import { CartItem } from "@shared/types";

export abstract class ICartService {
    public abstract getCart(userId: number): CartItem[];
    public abstract updateCart(userId: number, items: CartItem[]): void;
}
