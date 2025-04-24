import { IGameService } from "@api/interfaces/IGamesService";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Game } from "@shared/types";

/**
 * Service to retrieve games from the database.
 */
export class GameService implements IGameService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    /**
     * Retrieves all games from the database.
     */
    public async getGames(): Promise<Game[]> {
        return this.executeGamesQuery();
    }

    public async getGameById(id: number): Promise<Game[]> {
        return this.executeGameByNameQuery(id);
    }

    /**
     * Execute the games query.
     */
    private async executeGamesQuery(): Promise<Game[]> {
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
                    IF(
                        COUNT(gi.imageUrl) = 0, 
                        JSON_ARRAY(), 
                        JSON_ARRAYAGG(gi.imageUrl)
                    ) AS images
                FROM games g
                LEFT JOIN game_images gi ON g.id = gi.gameId
                GROUP BY g.id
                ORDER BY g.name
            `;

            const games: Game[] = await this._databaseService.query<Game[]>(connection, query);

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
