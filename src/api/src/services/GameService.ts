import { IGameService } from "@api/interfaces/IGameService";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Game, PaginatedResponse } from "@shared/types";

/**
 * Service to retrieve games from the database.
 */
export class GameService implements IGameService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    /**
     * Retrieves a paginated list of games.
     */
    public async getGames(page: number, limit: number): Promise<PaginatedResponse<Game>> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        const offset: number = (page - 1) * limit;

        try {
            const query: string = `
                SELECT 
                    g.id,
                    g.sku,
                    g.name,
                    g.thumbnail,
                    g.description,
                    g.price,
                    IF(
                        COUNT(gi.imageUrl) = 0, 
                        JSON_ARRAY(), 
                        JSON_ARRAYAGG(gi.imageUrl)
                    ) AS images
                FROM games g
                LEFT JOIN game_images gi ON g.id = gi.gameId
                GROUP BY g.id
                ORDER BY g.name
                LIMIT ?
                OFFSET ?
            `;

            const games: Game[] = await this._databaseService.query<Game[]>(
                connection,
                query,
                limit,
                offset
            );

            const countQuery: string = `
                SELECT COUNT(*) AS totalCount
                FROM games g
            `;

            const countResult: { totalCount: number }[] = await this._databaseService.query<{ totalCount: number }[]>(
                connection,
                countQuery
            );

            const paginatedResponse: PaginatedResponse<Game> = {
                items: games,
                pagination: {
                    totalItems: countResult[0].totalCount,
                    totalPages: Math.ceil(countResult[0].totalCount / limit),
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };

            return paginatedResponse;
        }
        finally {
            connection.release();
        }
    }

    /**
     * Retrieves all games owned by a specific user.
     */
    public async getOwnedGames(userId: number): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
                SELECT 
                    g.id,
                    g.sku,
                    g.name,
                    g.thumbnail,
                    g.description,
                    g.price,
                    g.playUrl AS url
                FROM games g
                JOIN orders_games og ON g.id = og.gameId
                JOIN orders o ON og.orderId = o.id
                WHERE o.userId = ? AND o.status = "paid" 
                GROUP BY g.id
            `;

            const ownedGames: Game[] = await this._databaseService.query<Game[]>(connection, query, userId);

            return ownedGames;
        }
        finally {
            connection.release();
        }
    }
}
