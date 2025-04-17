import { GamesApiResponse } from "@api/services/ExternalGamesService";
import { Seeder } from "./Seeder";
// import { faker } from "@faker-js/faker";

type GameImageRecord = {
    id?: number;
    gameId: number;
    imageUrl: string;
    sortOrder: number;
};

/**
 * Seeder for generating test data for the games table.
 *
 * @remarks This should later just import the games from https://lucastars.hbo-ict.cloud/api/games/json
 */
export class GameImagesSeeder extends Seeder<GameImageRecord> {
    /**
     * @inheritdoc
     */
    protected _table: string = "game_images";

    /**
     * @inheritdoc
     */
    protected async getRecords(_count: number): Promise<GameImageRecord[]> {
        const records: GameImageRecord[] = [];

        const games: GamesApiResponse[] = await this._externalGamesService.getGames();

        for (let i: number = 0; i < games.length; i++) {
            const game: GamesApiResponse = games[i];

            if (!game.Images) {
                continue;
            }

            for (let j: number = 0; j < game.Images.length; j++) {
                records.push({
                    gameId: i,
                    imageUrl: game.Images[j],
                    sortOrder: j,
                });
            }
        }

        // Fake data
        /* for (const gameId of gameIds) {
            for (let i: number = 0; i < count; i++) {
                records.push({
                    gameId: gameId,
                    imageUrl: faker.image.url(),
                    sortOrder: i,
                });
            }
        } */

        return records;
    }
}
