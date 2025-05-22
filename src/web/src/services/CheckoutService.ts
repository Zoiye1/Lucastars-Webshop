import { CheckoutItem } from "@shared/types";

export class CheckoutService {
    public async getCheckoutData(): Promise<CheckoutItem> {
        const res: Response = await fetch(`${VITE_API_URL}checkout`, { credentials: "include" });
        return await res.json() as unknown as CheckoutItem;
    }

    public async submitCheckout(data: CheckoutItem): Promise<CheckoutItem> {
        const res: Response = await fetch(`${VITE_API_URL}checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        return await res.json() as unknown as CheckoutItem;
    }
}
