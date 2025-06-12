import { Order, OrdersGames, PaginatedResponse } from "@shared/types";

export abstract class IOrdersGamesService {
    public abstract getOrdersGames(): Promise<OrdersGames[]>;
    public abstract getOrders(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: string
    ): Promise<PaginatedResponse<Order>>;
}
