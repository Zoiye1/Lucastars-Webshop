import { CheckoutItem } from "@shared/types";

export abstract class ICheckoutService {
    public abstract getCheckout(userId: number): Promise<CheckoutItem | null>;
}
