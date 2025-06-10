import { CheckoutItem, Payment, PaymentResponse } from "@shared/types";

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

    public async createPayment(data: Payment): Promise<PaymentResponse> {
        const res: Response = await fetch(`${VITE_API_URL}payments/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
        return await res.json() as unknown as PaymentResponse;
    }

    public async getPaymentStatus(): Promise<string> {
        const response = await fetch(`${VITE_API_URL}payments/status`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payment status");
        }

        const data = await response.json();
        return data.paymentStatus; // e.g., "Paid", "Pending", etc.
    }
}
