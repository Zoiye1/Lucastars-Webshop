import { Seeder } from "./Seeder";
import { faker } from "@faker-js/faker";

type GameImageRecord = {
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
    protected async getRecords(count: number): Promise<GameImageRecord[]> {
        const gameIds: number[] = await this.getExistingIds("games");

        if (!gameIds.length) {
            throw new Error("No game IDs found in the database. Did you run the GameSeeder?");
        }

        const records: GameImageRecord[] = [];

        for (let gameId: number = 0; gameId < gameIds.length; gameId++) {
            for (let i: number = 0; i < count; i++) {
                records.push({
                    gameId: gameIds[gameId],
                    imageUrl: faker.image.url(),
                    sortOrder: i,
                });
            }
        }

        return records;
    }
}
