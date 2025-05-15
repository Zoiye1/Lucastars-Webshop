import { Request, Response } from "express";
import { Cart } from "@shared/types";
import { CartService } from "@api/services/CartService";

export class CartController {
    private readonly _cartService: CartService = new CartService();
    /**
     * Cart
     */
    public async createCart(req: Request, res: Response): Promise<void> {
        const data: Cart = req.body as Cart;
        await this._cartService.createCart(
            req.userId,
            data.gameId,
            data.quantity
        );

        res.status(201).json({ success: true });
    };
}
