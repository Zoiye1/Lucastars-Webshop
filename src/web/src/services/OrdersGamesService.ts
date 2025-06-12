import { Order, OrdersGames, OrdersGamesResponse, PaginatedResponse } from "@shared/types";
import { IOrdersGamesService } from "@web/interfaces/IOrdersGamesService";

export class OrdersGamesService implements IOrdersGamesService {
    public async getOrdersGames(): Promise<OrdersGames[]> {
        const response: Response = await fetch(`${VITE_API_URL}orders-games`);

        const ordersGamesResponse: OrdersGamesResponse = await response.json() as unknown as OrdersGamesResponse;

        return ordersGamesResponse.ordersGames;
    }

    public async getOrders(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: string
    ): Promise<PaginatedResponse<Order>> {
        let url: string = `${VITE_API_URL}orders?page=${page}&limit=${limit}`;

        if (sort) {
            url += `&sort=${sort}`;
        }

        if (sortBy) {
            url += `&sortBy=${sortBy}`;
        }

        const response: Response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        const ordersResponse: PaginatedResponse<Order> = await response.json() as unknown as PaginatedResponse<Order>;

        return ordersResponse;
    }
}
