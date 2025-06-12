import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { GameTagCount, OrdersByMonth, TurnoverByMonth } from "@shared/types";

export class ChartService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getTurnoverByYear(year: number): Promise<TurnoverByMonth[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
                SELECT MONTH(orderDate) AS month, SUM(totalAmount) AS turnover
                FROM orders
                WHERE YEAR(orderDate) = ?
                GROUP BY MONTH(orderDate)
                ORDER BY MONTH(orderDate)
            `;

            const result: TurnoverByMonth[] = await this._databaseService.query(
                connection,
                query,
                year
            );

            return result;
        }
        finally {
            connection.release();
        }
    }

    public async getOrdersByMonth(): Promise<OrdersByMonth[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
                SELECT DATE_FORMAT(orderDate, '%m/%d') AS date, COUNT(*) AS orderCount
                FROM orders
                WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 31 DAY)
                GROUP BY date
                ORDER BY date
            `;

            const result: OrdersByMonth[] = await this._databaseService.query(
                connection,
                query
            );

            return result;
        }
        finally {
            connection.release();
        }
    }

    public async getGamesTags(): Promise<GameTagCount[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
                SELECT COALESCE(value, "Geen categorie") as tag, COUNT(games.id) AS count
                FROM games
                LEFT JOIN games_tags ON games.id = games_tags.gameId
                LEFT JOIN tags ON tags.id = games_tags.tagId
                GROUP BY value
                ORDER BY value
            `;

            const result: GameTagCount[] = await this._databaseService.query(connection, query);

            return result;
        }
        finally {
            connection.release();
        }
    }
}
