import { Request, Response } from "express";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";
import { CheckoutService } from "@api/services/CheckoutService";
import { CheckoutItem, Payment, PaymentReturnResponse, InvoiceOrder } from "@shared/types";
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

    public async createPayment(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const data: Payment | undefined = req.body as Payment | undefined;

        if (!data) {
            res.status(400);
            return;
        }
        if (typeof data.orderId !== "number") {
            res.status(400).json({ error: "Invalid orderId" });
            return;
        }
        const transactionId: string | undefined = await this._checkoutService.createPayment(data.orderId, data.value);

        if (!transactionId) {
            res.status(400);
            return;
        }
        res.status(200).json({ transactionId });
    }

    public async postCheckout(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const item: CheckoutItem | undefined = req.body as CheckoutItem | undefined;

        if (!item) {
            res.status(400).json({ error: "Invalid checkout data" });
            return;
        }

        try {
            const result: CheckoutItem | null = await this._checkoutService.postCheckout(userId, item);

            if (!result || !result.orderId) {
                res.status(400).json({ error: "Failed to create order" });
                return;
            }

            res.json(result);
        }
        catch (error) {
            console.error("Checkout error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    public async getPaymentStatus(req: Request, res: Response): Promise<void> {
        const orderId: number = Number((req.query as { orderId: string }).orderId);
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401).send("Unauthorized");
            return;
        }

        const paymentReturnStatus: PaymentReturnResponse | undefined = await this._checkoutService.handlePaymentReturn(orderId);

        if (!paymentReturnStatus) {
            res.status(400).json({ error: "Failed to retrieve payment status" });
            return;
        }

        res.status(200).json({ status: paymentReturnStatus.status, transactionId: paymentReturnStatus.transactionId });
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

        const order: InvoiceOrder | undefined = await this._ordersGamesService.getOrderById(orderId);

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
