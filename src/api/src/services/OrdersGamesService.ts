import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { OrdersGames } from "@shared/types";
import { IOrdersGamesService } from "@api/interfaces/IOrdersGamesService";

/**
 * Service to retrieve games from the database.
 */
export class OrdersGamesService implements IOrdersGamesService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getOrdersGames(): Promise<OrdersGames[]> {
        return this.executeOrdersGamesQuery();
    }

    /**
     * Execute the games query.
     */
    private async executeOrdersGamesQuery(): Promise<OrdersGames[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
            SELECT 
                og.gameId,
                o.userId,
                g.name,
                g.thumbnail,
                og.price
            FROM orders_games og
            JOIN orders o ON og.orderId = o.id
            JOIN games g ON g.id = og.gameId
        `;

            const result: OrdersGames[] = await this._databaseService.query<OrdersGames[]>(connection, query);
            return result;
        }
        finally {
            connection.release();
        }
    }
}
