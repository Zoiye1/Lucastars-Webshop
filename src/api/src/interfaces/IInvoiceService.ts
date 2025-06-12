import { Order } from "@shared/types";

@Interface
export abstract class IInvoiceService {
    public abstract generateInvoice(order: Order): Buffer;
}
