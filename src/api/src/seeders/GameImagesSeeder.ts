import { Seeder } from "./Seeder";
import { faker } from "@faker-js/faker";

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
    protected getRecords(count: number, gameIds: number[]): GameImageRecord[] {
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
