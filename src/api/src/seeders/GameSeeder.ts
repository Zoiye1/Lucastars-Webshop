import { Seeder } from "./Seeder";
import { faker } from "@faker-js/faker";

/**
 * Seeder for generating test data for the games table.
 *
 * @remarks This should later just import the games from https://lucastars.hbo-ict.cloud/api/games/json
 */
export class GameSeeder extends Seeder {
    /**
     * @inheritdoc
     */
    protected _tableName: string = "games";

    /**
     * @inheritdoc
     */
    protected _tableColumns: string[] = [
        "sku",
        "name",
        "thumbnail",
        "description",
        "playUrl",
    ];

    /**
     * @inheritdoc
     */
    protected getRecords(count: number): object[] {
        const records: object[] = [];

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
