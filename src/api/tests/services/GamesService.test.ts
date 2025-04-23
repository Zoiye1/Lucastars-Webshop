import { beforeEach, describe, expect, test, vi } from "vitest";

import { IGameService } from "@api/interfaces/IGamesService";
import { GameService } from "@api/services/GamesService";
import { Game } from "@shared/types";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("GamesService", () => {
    test("executeGamesQuery should return a list of games", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query
            .mockResolvedValue([
                {
                    id: 1,
                    sku: "game-sku-1",
                    name: "Game 1",
                    thumbnail: "https://example.com/thumbnail1.jpg",
                    description: "Description 1",
                    images: [
                        "https://example.com/image1.jpg",
                        "https://example.com/image2.jpg",
                    ],
                },
                {
                    id: 2,
                    sku: "game-sku-2",
                    name: "Game 2",
                    thumbnail: "https://example.com/thumbnail2.jpg",
                    description: "Description 2",
                    images: [
                        "https://example.com/image3.jpg",
                    ],
                },
            ]);

        // Act
        const games: Game[] = await gameService.getGames();

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBeGreaterThan(0);
    });

    test("executeGamesQuery should return an empty array if no games are found", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query
            .mockResolvedValue([]);

        // Act
        const games: Game[] = await gameService.getGames();

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(0);
    });
});
