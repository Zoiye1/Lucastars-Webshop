import { Order, OrdersGames, PaginatedResponse, GetOrdersOptions, InvoiceOrder } from "@shared/types";

@Interface
export abstract class IOrdersGamesService {
    public abstract getOrdersGames(): Promise<OrdersGames[]>;
    public abstract getOrders(options: GetOrdersOptions): Promise<PaginatedResponse<Order>>;
    public abstract getOrderById(orderId: number): Promise<InvoiceOrder | undefined>;
}
