import { InvoiceOrder } from "@shared/types";

@Interface
export abstract class IInvoiceService {
    public abstract generateInvoiceMail(order: InvoiceOrder): string;
    public abstract generateInvoice(order: InvoiceOrder): Buffer;
}
