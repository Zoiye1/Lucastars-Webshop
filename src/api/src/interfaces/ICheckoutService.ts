import { CheckoutItem } from "@shared/types";

export abstract class ICheckoutService {
    public abstract getCheckout(userId: number): Promise<CheckoutItem | null>;
    public abstract postCheckout(userId: number, item: CheckoutItem): Promise<CheckoutItem | null>;
}
