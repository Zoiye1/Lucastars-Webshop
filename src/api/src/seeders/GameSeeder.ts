import { GamesApiResponse } from "@api/services/ExternalGamesService";
import { Seeder } from "./Seeder";
// import { faker } from "@faker-js/faker";

export type GameRecord = {
    id?: number;
    sku: string;
    name: string;
    thumbnail: string;
    description: string;
    playUrl: string;
};

/**
 * Seeder for generating test data for the games table.
 *
 * @remarks This should later just import the games from https://lucastars.hbo-ict.cloud/api/games/json
 */
export class GameSeeder extends Seeder<GameRecord> {
    /**
     * @inheritdoc
     */
    protected _table: string = "games";

    /**
     * @inheritdoc
     */
    protected async getRecords(_count: number): Promise<GameRecord[]> {
        const games: GamesApiResponse[] = await this._externalGamesService.getGames();

        const records: GameRecord[] = [];
        for (const game of games) {
            records.push({
                sku: game.SKU,
                name: game.Title,
                thumbnail: game.Thumbnail,
                description: game.DescriptionHtml,
                playUrl: game.Url,
            });
        }

        // Fake data
        /* for (let i: number = 0; i < count; i++) {
            records.push({
                sku: faker.string.uuid(),
                name: faker.commerce.productName(),
                thumbnail: faker.image.url(),
                description: faker.lorem.paragraph(),
                playUrl: faker.internet.url(),
            });
        } */

        return records;
    }
}
