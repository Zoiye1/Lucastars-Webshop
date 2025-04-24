import { Cart, CartItem } from "@shared/types";

export abstract class ICartService {
    public abstract createCart(data: CartItem): Promise<Cart[]>;
}
