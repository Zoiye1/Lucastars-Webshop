import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Order, OrdersGames } from "@shared/types";
import { IOrdersGamesService } from "@api/interfaces/IOrdersGamesService";

/**
 * Service to retrieve games from the database.
 */
export class OrdersGamesService implements IOrdersGamesService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getOrdersGames(): Promise<OrdersGames[]> {
        return this.executeOrdersGamesQuery();
    }

    public async getOrderById(orderId: number): Promise<Order | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
                SELECT 
                    o.id,
                    o.userId,
                    o.orderDate,
                    o.status,
                    o.totalAmount,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', g.id,
                            'sku', g.sku,
                            'name', g.name,
                            'thumbnail', g.thumbnail,
                            'price', og.price
                        )
                    ) as 'games',
                    JSON_OBJECT(
                        'id', u.id,
                        'username', u.username,
                        'email', u.email,
                        'firstName', u.firstName,
                        'prefix', u.prefix,
                        'lastName', u.lastName,
                        'street', ua.street,
                        'houseNumber', ua.houseNumber,
                        'postalCode', ua.postalCode,
                        'city', ua.city,
                        'country', ua.country
                    ) as 'user'
                FROM orders o
                LEFT JOIN orders_games og ON og.orderId = o.id
                LEFT JOIN games g ON og.gameId = g.id
                LEFT JOIN users u ON o.userId = u.id
                LEFT JOIN addresses ua ON u.id = ua.userId
                WHERE o.id = ?
                GROUP BY o.id
            `;

            const result: Order[] = await this._databaseService.query<Order[]>(connection, query, orderId);

            if (result.length !== 1) {
                return undefined;
            }

            return result[0];
        }
        finally {
            connection.release();
        }
    }

    /**
     * Execute the games query.
     */
    private async executeOrdersGamesQuery(): Promise<OrdersGames[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
            SELECT 
                g.id as 'gameId',
                g.name,
                g.thumbnail,
                g.price
            FROM games g
            LEFT JOIN orders_games og ON og.gameId = g.id
            GROUP BY g.id
            ORDER BY COUNT(og.gameId) DESC, g.name
            LIMIT 10
        `;

            const result: OrdersGames[] = await this._databaseService.query<OrdersGames[]>(connection, query);
            return result;
        }
        finally {
            connection.release();
        }
    }
}
