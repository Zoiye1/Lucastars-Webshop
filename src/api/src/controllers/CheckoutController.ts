import { Request, Response } from "express";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";
import { CheckoutService } from "@api/services/CheckoutService";
import { CheckoutItem } from "@shared/types";

export class CheckoutController {
    private readonly _checkoutService: ICheckoutService = new CheckoutService();

    public async getCheckout(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const item: CheckoutItem | null = await this._checkoutService.getCheckout(userId);
        res.json(item);
    }

    public async postCheckout(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const item: CheckoutItem | undefined = req.body as CheckoutItem | undefined;

        if (!item) {
            res.status(400);
            return;
        }

        const result: CheckoutItem | null = await this._checkoutService.postCheckout(userId, item);

        if (!result) {
            res.status(400);
            return;
        }

        res.json(result);
    }
}
