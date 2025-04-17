import { config } from "dotenv";
import { GameRecord, GameSeeder } from "./GameSeeder";
import { DatabaseService } from "@api/services/DatabaseService";
import { GameImagesSeeder } from "./GameImagesSeeder";
import { scanner } from "@hboictcloud/scanner";

async function main(): Promise<void> {
    const confirmAnswer: boolean = await scanner.promptBoolean(
        "Het seeden van de database zal de meeste tabellen legen. Weet je zeker dat je dit wilt doen? (yes/no) "
    );

    const devMode: boolean = process.argv.includes("--dev");

    if (!confirmAnswer) {
        console.log("Database seeding aborted.");
        process.exit(0);
    }

    // Load the .env files
    config();
    config({ path: ".env.local", override: true });

    const databaseService: DatabaseService = new DatabaseService();

    console.log("Starting database seeding...");

    // Seeders
    const gameSeeder: GameSeeder = new GameSeeder(devMode, databaseService);
    await gameSeeder.truncate();

    const gameImagesSeeder: GameImagesSeeder = new GameImagesSeeder(devMode, databaseService);
    await gameImagesSeeder.truncate();

    // Seed 10 random games
    const games: GameRecord[] = await gameSeeder.seed(10);

    // Seed 3 random images for each game we just created
    await gameImagesSeeder.seed(
        3,
        games.map(game => game.id || 0)
    );
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
