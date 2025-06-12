import { Request, Response } from "express";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";
import { CheckoutService } from "@api/services/CheckoutService";
import { CheckoutItem, Order } from "@shared/types";
import { PassThrough } from "stream";
import { OrdersGamesService } from "@api/services/OrdersGamesService";
import { IOrdersGamesService } from "@api/interfaces/IOrdersGamesService";
import { IInvoiceService } from "@api/interfaces/IInvoiceService";
import { InvoiceService } from "@api/services/InvoiceService";

export class CheckoutController {
    private readonly _checkoutService: ICheckoutService = new CheckoutService();
    private readonly _ordersGamesService: IOrdersGamesService = new OrdersGamesService();
    private readonly _invoiceService: IInvoiceService = new InvoiceService();

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

    public async getInvoice(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const orderId: number | undefined = req.params.orderId ? parseInt(req.params.orderId, 10) : undefined;

        if (!orderId) {
            res.status(400).json({ message: `Invalid order ID. ${orderId}` });
            return;
        }

        const order: Order | undefined = await this._ordersGamesService.getOrderById(orderId);

        if (!order || order.user.id !== userId) {
            res.status(404).json({ message: "Order not found." });
            return;
        }

        const fileName: string = `invoice-${order.id}.pdf`;
        const pdfBuffer: Buffer = this._invoiceService.generateInvoice(order);

        const readStream: PassThrough = new PassThrough();
        readStream.end(pdfBuffer);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=${fileName}`);

        readStream.pipe(res);
    }
}
