import { IGameService } from "@api/interfaces/IGameService";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";

/**
 * Service to retrieve games from the database.
 */
export class GameService implements IGameService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    /**
     * Retrieves a paginated list of games.
     */
    public async getGames(options: GetGamesOptions): Promise<PaginatedResponse<Game>> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        const offset: number = (options.page - 1) * options.limit;

        const sortByQuery: string = options.sortBy
            ? `ORDER BY g.${options.sortBy} ${options.sort === "desc" ? "DESC" : "ASC"}`
            : `ORDER BY g.name ${options.sort === "desc" ? "DESC" : "ASC"}`;

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
                ${sortByQuery}
                LIMIT ?
                OFFSET ?
            `;

            const games: Game[] = await this._databaseService.query<Game[]>(
                connection,
                query,
                options.limit,
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
                    totalPages: Math.ceil(countResult[0].totalCount / options.limit),
                    currentPage: options.page,
                    itemsPerPage: options.limit,
                },
            };

            return paginatedResponse;
        }
        finally {
            connection.release();
        }
    }

    public async getGameById(id: number): Promise<Game[]> {
        return this.executeGameByNameQuery(id);
    }

    /**
     * Retrieves all games owned by a specific user.
     */
    public async getOwnedGames(userId: number, gameId?: number): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const gameIdCondition: string = gameId ? "AND g.id = ?" : "";

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
                WHERE o.userId = ? AND o.status = "paid" ${gameIdCondition}
                GROUP BY g.id
            `;

            const params: unknown[] = [userId];

            if (gameId) {
                params.push(gameId);
            }

            const ownedGames: Game[] = await this._databaseService.query<Game[]>(connection, query, ...params);

            return ownedGames;
        }
        finally {
            connection.release();
        }
    }

    /**
     * Searches for games based on a query string.
     */
    public async searchGames(query: string): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const sqlQuery: string = `
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
                WHERE g.name LIKE ?
                GROUP BY g.id
                ORDER BY g.name
            `;

            const games: Game[] = await this._databaseService.query<Game[]>(connection, sqlQuery, `%${query}%`);

            return games;
        }
        finally {
            connection.release();
        }
    }

    private async executeGameByNameQuery(id: number): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
            SELECT 
                name,
                thumbnail,
                description,
                price
            FROM GAMES
            WHERE
                id = "${id}"
        `;

            return await this._databaseService.query<Game[]>(connection, query);
        }
        finally {
            connection.release();
        }
    }
}
