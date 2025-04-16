import { config } from "dotenv";
import { GameSeeder } from "./GameSeeder";
import { DatabaseService } from "@api/services/DatabaseService";
import { GameImagesSeeder } from "./GameImagesSeeder";

async function main(): Promise<void> {
    // Load the .env files
    config();
    config({ path: ".env.local", override: true });

    const databaseService: DatabaseService = new DatabaseService();

    console.log("Starting database seeding...");

    // Seeders
    const gameSeeder: GameSeeder = new GameSeeder(databaseService);
    const gameImagesSeeder: GameImagesSeeder = new GameImagesSeeder(databaseService);

    // Seed 10 random games
    await gameSeeder.seed(10);

    // Seed 3 random images for each game we just created
    await gameImagesSeeder.seed(3);
}

main()
    .then(() => {
        console.log("Database seeding completed.");
    })
    .catch((error: unknown) => {
        console.error("Error during database seeding:", error);
    })
    .finally(() => {
        process.exit(0);
    });
