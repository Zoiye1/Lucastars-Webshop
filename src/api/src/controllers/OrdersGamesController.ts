import { IOrdersGamesService } from "@api/interfaces/IOrdersGamesService";
import { OrdersGamesService } from "@api/services/OrdersGamesService";
import { GetOrdersOptions, Order, OrdersGames, PaginatedResponse } from "@shared/types";
import { Request, Response } from "express";

/**
 * This controller is responsible for handling requests related to games.
 */
export class OrdersGamesController {
    private readonly _ordersGamesService: IOrdersGamesService = new OrdersGamesService();

    /**
     * Handles the request to get all games.
     *
     * @remarks This will later be paginated and will handle filtering and/or sorting.
     */
    public async getOrdersGames(_req: Request, res: Response): Promise<void> {
        const ordersGames: OrdersGames[] = await this._ordersGamesService.getOrdersGames();

        res.json({
            ordersGames: ordersGames,
        });
    }

    public async getOrders(req: Request, res: Response): Promise<void> {
        const options: GetOrdersOptions = {
            page: parseInt(req.query.page as string, 10) || 1,
            limit: parseInt(req.query.limit as string, 10) || 10,
            sort: req.query.sort ? (req.query.sort as "asc" | "desc") : undefined,
            sortBy: req.query.sortBy ? (req.query.sortBy as string) : undefined,
        };

        if (options.page < 1) {
            res.status(400).json({
                error: "Page must be greater than 0",
            });
            return;
        }

        if (options.limit < 1) {
            res.status(400).json({
                error: "Limit must be greater than 0",
            });
            return;
        }

        if (options.sort && !["asc", "desc"].includes(options.sort)) {
            res.status(400).json({
                error: "Invalid sort value",
            });
            return;
        }

        if (options.sortBy && !["id", "user.email", "orderDate", "items", "price", "status", "totalAmount"].includes(options.sortBy)) {
            res.status(400).json({
                error: "Invalid sortBy value",
            });
            return;
        }

        const paginatedResult: PaginatedResponse<Order> = await this._ordersGamesService.getOrders(options);
        res.json(paginatedResult);
    }
}
