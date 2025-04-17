import { ExternalGamesService, GamesApiResponse } from "@api/services/ExternalGamesService";
import { Seeder } from "./Seeder";
import { faker } from "@faker-js/faker";

type GameImageRecord = {
    id?: number;
    gameId: number;
    imageUrl: string;
    sortOrder: number;
};

/**
 * Seeder for generating data for the games table.
 */
export class GameImagesSeeder extends Seeder<GameImageRecord> {
    private readonly _externalGamesService: ExternalGamesService = new ExternalGamesService();

    /**
     * @inheritdoc
     */
    protected _table: string = "game_images";

    /**
     * @inheritdoc
     */
    protected async getRecords(): Promise<GameImageRecord[]> {
        const games: GamesApiResponse[] = await this._externalGamesService.getGames();

        const records: GameImageRecord[] = [];
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

        return records;
    }

    /**
     * @inheritdoc
     */
    protected getRecordsDev(count: number, gameIds: number[]): GameImageRecord[] {
        const records: GameImageRecord[] = [];

        for (const gameId of gameIds) {
            for (let i: number = 0; i < count; i++) {
                records.push({
                    gameId: gameId,
                    imageUrl: faker.image.url(),
                    sortOrder: i,
                });
            }
        }

        return records;
    }
}
