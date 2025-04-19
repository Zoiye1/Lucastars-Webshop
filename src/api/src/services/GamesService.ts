import { IGamesService } from "@api/interfaces/IGamesService";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Game } from "@shared/types";

/**
 * Service to retrieve games from the database.
 */
export class GameService implements IGamesService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    /**
     * Retrieves all games from the database.
     */
    public async getGames(): Promise<Game[]> {
        return this.executeGamesQuery();
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
                    IF(
                        COUNT(gi.imageUrl) = 0, 
                        JSON_ARRAY(), 
                        JSON_ARRAYAGG(gi.imageUrl ORDER BY gi.sortOrder)
                    ) AS images
                FROM games g
                LEFT JOIN game_images gi ON g.id = gi.gameId
                GROUP BY g.id
                ORDER BY g.name
            `;

            const result: Game[] = await this._databaseService.query<Game[]>(connection, query);

            // Images are returned as a JSON string from the database, so we need to parse it to a string array
            const games: Game[] = result.map(row => ({
                ...row,
                images: JSON.parse(row.images as unknown as string) as string[],
            }));

            return games;
        }
        finally {
            connection.release();
        }
    }
}
