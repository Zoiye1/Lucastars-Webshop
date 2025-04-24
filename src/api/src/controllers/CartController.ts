import { Request, Response } from "express";
import { Cart } from "@shared/types";
import { CartService } from "@api/services/CartService";

export class CartController {
    private readonly _cartService: CartService = new CartService();
    /**
     * Cart
     */
    public createCart = async (req: Request, _res: Response): Promise<void> => {
        const data: Cart = req.body as Cart;
        console.log("we zijn hier");
        console.log(data);
        await this._cartService.createCart(
            1,
            data.gameId,
            data.quantity
        );
    };
}
