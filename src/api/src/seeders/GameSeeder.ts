import { ExternalGamesService, GamesApiResponse } from "@api/services/ExternalGamesService";
import { Seeder } from "./Seeder";
import { faker } from "@faker-js/faker";

export type GameRecord = {
    id?: number;
    sku: string;
    name: string;
    thumbnail: string;
    description: string;
    playUrl: string;
};

/**
 * Seeder for generating data for the games table.
 */
export class GameSeeder extends Seeder<GameRecord> {
    private readonly _externalGamesService: ExternalGamesService = new ExternalGamesService();

    /**
     * @inheritdoc
     */
    protected _table: string = "games";

    /**
     * @inheritdoc
     */
    protected async getRecords(): Promise<GameRecord[]> {
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

        return records;
    }

    /**
     * @inheritdoc
     */
    protected getRecordsDev(count: number): GameRecord[] {
        const records: GameRecord[] = [];

        for (let i: number = 0; i < count; i++) {
            records.push({
                sku: faker.string.uuid(),
                name: faker.commerce.productName(),
                thumbnail: faker.image.url(),
                description: faker.lorem.paragraph(),
                playUrl: faker.internet.url(),
            });
        }

        return records;
    }
}
