import { Seeder } from "./Seeder";
import { faker } from "@faker-js/faker";

/**
 * Seeder for generating test data for the games table.
 *
 * @remarks This should later just import the games from https://lucastars.hbo-ict.cloud/api/games/json
 */
export class GameImagesSeeder extends Seeder {
    /**
     * @inheritdoc
     */
    protected _tableName: string = "game_images";

    /**
     * @inheritdoc
     */
    protected _tableColumns: string[] = [
        "gameId",
        "imageUrl",
        "sortOrder",
    ];

    /**
     * @inheritdoc
     */
    protected async getRecords(count: number): Promise<object[]> {
        const gameIds: number[] = await this.getExistingIds("games");

        if (!gameIds.length) {
            throw new Error("No game IDs found in the database. Did you run the GameSeeder?");
        }

        const records: object[] = [];

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
