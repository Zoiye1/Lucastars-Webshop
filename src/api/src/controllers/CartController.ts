import { Request, Response } from "express";
import { ICartService } from "@api/interfaces/ICartService";
import { CartService } from "@api/services/CartService";
import { CartItem } from "@shared/types";

export class CartController {
    private readonly _cartService: ICartService = new CartService();

    public getCart(req: Request, res: Response): void {
        const userId: number = req.userId ?? 1; // fallback demo user
        const items: CartItem[] = this._cartService.getCart(userId);
        res.json(items);
    }

    public updateCart(req: Request, res: Response): void {
        const userId: number = req.userId ?? 1;
        const items: CartItem[] = req.body as CartItem[];
        this._cartService.updateCart(userId, items);
        res.status(204).end();
    }
}
