import { Order, OrdersGames } from "@shared/types";

@Interface
export abstract class IOrdersGamesService {
    public abstract getOrdersGames(): Promise<OrdersGames[]>;
    public abstract getOrderById(orderId: number): Promise<Order | undefined>;
}
