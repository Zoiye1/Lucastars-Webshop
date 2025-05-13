import { CartItem } from "@shared/types";

export abstract class ICartService {
    public abstract getCart(userId: number): Promise<CartItem[]>;
    public abstract updateCart(userId: number, items: CartItem[]): void;
    public abstract deleteCartItem(userId: number, gameId: number): Promise<void>;
}
