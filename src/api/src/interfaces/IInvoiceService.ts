import { InvoiceOrder } from "@shared/types";

@Interface
export abstract class IInvoiceService {
    public abstract generateInvoice(order: InvoiceOrder): Buffer;
}
