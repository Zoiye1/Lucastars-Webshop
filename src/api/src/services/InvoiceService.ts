import { IInvoiceService } from "@api/interfaces/IInvoiceService";
import { InvoiceOrder, IUser, Order } from "@shared/types";
import { jsPDF } from "jspdf";
import autoTable, { CellDef } from "jspdf-autotable";

export class InvoiceService implements IInvoiceService {
    private readonly _vat: number = 21;

    private readonly _font: string = "Helvetica";
    private readonly _pageMargin: number = 5;

    /**
     * Generates a PDF invoice for the given order.
     * @param order The order for which the invoice is to be generated.
     * @returns A Buffer containing the PDF invoice data.
     */
    public generateInvoice(order: InvoiceOrder): Buffer {
        const document: jsPDF = new jsPDF({
            orientation: "portrait",
            format: "a4",
        });

        const pageWidth: number = document.internal.pageSize.getWidth();

        document.setFont(this._font);

        // Centered heading title
        document.setFontSize(24);
        document.setFont(this._font, "bold");
        document.text("Factuur", pageWidth / 2, 18, { align: "center" });
        document.setFont(this._font, "normal");

        // Left side - Store details
        this.renderStoreInformation(document);

        // Left side - Customer details
        this.renderCustomerDetails(document, order.user);

        // Right side - Invoice details
        this.renderInvoiceInfo(document, order);

        // Table
        this.renderOrderSummaryTable(document, order);

        const arrayBuffer: ArrayBuffer = document.output("arraybuffer");

        return Buffer.from(arrayBuffer);
    }

    private renderStoreInformation(document: jsPDF): void {
        document.setFontSize(12);

        const storeDetails: string[] = [
            "LucaStars",
            "Van Hallstraat 123",
            "1051 HE Amsterdam",
            "KvK: 81234567",
            "BTW: NL001234567B01",
            "IBAN: NL91 ABNA 0417 1643 00",
        ];

        let yPosition: number = 35;

        storeDetails.forEach((line, index) => {
            if (index === 0) {
                document.setFont(this._font, "bold");
            }
            else {
                document.setFont(this._font, "normal");
            }

            document.text(line, this._pageMargin, yPosition);
            yPosition += 5;
        });
    }

    private renderInvoiceInfo(document: jsPDF, order: Order): void {
        const pageWidth: number = document.internal.pageSize.getWidth();

        const invoiceDate: string = new Date().toLocaleDateString();
        const invoiceNumber: string = order.id.toString().padStart(6, "0");

        document.setFont(this._font, "bold");
        document.text("Factuurdatum:", pageWidth - 60, 35);
        document.setFont(this._font, "normal");

        document.text(invoiceDate, pageWidth - 25, 35);

        document.setFont(this._font, "bold");
        document.text("Factuurnummer:", pageWidth - 60, 40);
        document.setFont(this._font, "normal");

        document.text(`F${invoiceNumber}`, pageWidth - 25, 40);
    }

    private renderCustomerDetails(document: jsPDF, user: IUser): void {
        document.setFontSize(12);
        const customerDetails: string[] = [
            "Factuur aan:",
            this.formatFullName(user),
            user.street || "",
            `${user.postalCode} ${user.city}`,
            user.country || "",
        ];

        let yPosition: number = 70;
        customerDetails.forEach((line, index) => {
            if (index === 0) {
                document.setFont(this._font, "bold");
            }
            else {
                document.setFont(this._font, "normal");
            }
            document.text(line, this._pageMargin, yPosition);
            yPosition += 5;
        });
    }

    private renderOrderSummaryTable(document: jsPDF, order: Order): void {
        const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const tableData: (string | CellDef)[][] = order.games.map(game => {
            const priceExclVat: number = game.price / (1 + this._vat / 100);
            const total: number = game.price * 1;

            return [game.name, "1", currencyFormatter.format(priceExclVat), currencyFormatter.format(total)];
        });

        // Calculate totals
        const subtotalExclVat: number = (order.totalAmount / (1 + this._vat / 100));
        const vatAmount: number = (order.totalAmount - (order.totalAmount / (1 + this._vat / 100)));
        const totalInclVat: number = order.totalAmount;

        // Add summary rows
        tableData.push(
            [
                { content: "Subtotaal (excl. BTW)", colSpan: 3, styles: { fontStyle: "bold" } },
                currencyFormatter.format(subtotalExclVat),
            ],
            [
                { content: `BTW (${this._vat}%)`, colSpan: 3, styles: { fontStyle: "bold" } },
                currencyFormatter.format(vatAmount),
            ],
            [
                { content: "Totaal (incl. BTW)", colSpan: 3, styles: { fontStyle: "bold" } },
                { content: currencyFormatter.format(totalInclVat), styles: { fontStyle: "bold" } },
            ]
        );

        autoTable(document, {
            head: [["Omschrijving", "Aantal", "Prijs (excl. BTW)", "Totaal"]],
            body: tableData,
            margin: { top: 95, left: this._pageMargin, right: this._pageMargin },
            styles: {
                cellPadding: 3,
                font: this._font,
                fontSize: 12,
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: "bold",
                lineWidth: 0.1,
                lineColor: [200, 200, 200],
            },
            bodyStyles: {
                lineWidth: 0.1,
                lineColor: [200, 200, 200],
                fillColor: [255, 255, 255],
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255],
            },
        });
    }

    private formatFullName(user: IUser): string {
        const parts: string[] = [user.firstName, user.prefix, user.lastName].filter(part => part !== null);

        return parts.join(" ").trim();
    }
}
