import { Request, Response } from "express";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";
import { CheckoutService } from "@api/services/CheckoutService";
import { CheckoutItem } from "@shared/types";

export class CheckoutController {
    private readonly _checkoutService: ICheckoutService = new CheckoutService();

    public async getCheckout(req: Request, res: Response): Promise<void> {
        const userId: number = req.userId ?? 1; // fallback demo user
        const item: CheckoutItem | null = await this._checkoutService.getCheckout(userId);
        res.json(item);
    }
}
