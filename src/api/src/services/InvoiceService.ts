import { IInvoiceService } from "@api/interfaces/IInvoiceService";
import { Order } from "@shared/types";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import puppeteer, { Browser, Page } from "puppeteer";

export class InvoiceService implements IInvoiceService {
    private readonly _vat: number = 21; // 21% VAT

    /**
     * Generates a PDF invoice for the given order.
     * @param order The order for which the invoice is to be generated.
     * @remarks This method uses Puppeteer to render an HTML template into a PDF format.
     * @returns A promise that resolves to a base64 encoded string of the PDF invoice.
     */
    public async generateInvoice(order: Order): Promise<string> {
        const html: string = this.invoiceHTML(order);

        const browser: Browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer: Uint8Array = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        return Buffer.from(pdfBuffer).toString("base64");
    }

    private invoiceHTML(order: Order): string {
        const templateHtml: string = readFileSync(
            "./src/templates/invoice.html",
            "utf8"
        );

        const template: Handlebars.TemplateDelegate = Handlebars.compile(templateHtml);

        return template({
            invoiceNumber: order.id.toString().padStart(6, "0"),
            date: new Date().toLocaleDateString(),
            vat: this._vat,
            products: order.games.map(game => ({
                description: game.name,
                quantity: 1,
                price: (game.price / (1 + this._vat / 100)).toFixed(2),
                total: (game.price).toFixed(2),
            })),
            client: {
                name: `${order.user.firstName} ${order.user.lastName}`,
                street: order.user.street,
                houseNumber: order.user.houseNumber,
                city: order.user.city,
                postalCode: order.user.postalCode,
                country: order.user.country,
            },
            subtotal: (order.totalAmount / (1 + this._vat / 100)).toFixed(2),
            total: Number(order.totalAmount).toFixed(2),
            vatAmount: (order.totalAmount - (order.totalAmount / (1 + this._vat / 100))).toFixed(2),
        });
    }
}
