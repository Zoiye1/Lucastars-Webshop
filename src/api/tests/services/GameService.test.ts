import { beforeEach, describe, expect, test, vi } from "vitest";

import { IGameService } from "@api/interfaces/IGameService";
import { GameService } from "@api/services/GameService";
import { Game } from "@shared/types";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("GameService", () => {
    test("getGames should return properly structured game objects", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([{
            id: 1,
            sku: "game-sku-1",
            name: "Game 1",
            thumbnail: "https://example.com/thumbnail1.jpg",
            description: "Description 1",
            images: [
                "https://example.com/image1.jpg",
            ],
        }]);

        // Act
        const games: Game[] = await gameService.getGames();

        // Assert
        expect(games[0]).toHaveProperty("id");
        expect(games[0]).toHaveProperty("name");
        expect(games[0]).toHaveProperty("thumbnail");
        expect(games[0]).toHaveProperty("description");
        expect(games[0]).toHaveProperty("images");
        expect(Array.isArray(games[0].images)).toBe(true);
        expect(games[0].images.length).toBe(1);
    });

    test("executeGamesQuery should return a list of games", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([
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
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const games: Game[] = await gameService.getGames();

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(0);
    });

    test("getGames should handle database errors gracefully", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValue(new Error("Database connection failed"));

        // Act & Assert
        await expect(gameService.getGames()).rejects.toThrow();
    });

    test("getOwnedGames should return a list of games owned by a user", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([
            {
                id: 1,
                sku: "game-sku-1",
                name: "Game 1",
                thumbnail: "https://example.com/thumbnail1.jpg",
                description: "Description 1",
                price: 19.99,
                url: "https://example.com/play/game1",
            },
            {
                id: 2,
                sku: "game-sku-2",
                name: "Game 2",
                thumbnail: "https://example.com/thumbnail2.jpg",
                description: "Description 2",
                price: 29.99,
                url: "https://example.com/play/game2",
            },
        ]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1);

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(2);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining("WHERE o.userId = ?"),
            1
        );
    });

    test("getOwnedGames should return empty array when user doesn't own any games", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1337);

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(0);
    });

    test("getOwnedGames should return properly structured game objects", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([
            {
                id: 1,
                sku: "game-sku-1",
                name: "Game 1",
                thumbnail: "https://example.com/thumbnail1.jpg",
                description: "Description 1",
                price: 19.99,
                url: "https://example.com/play/game1",
            },
        ]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1);

        // Assert
        expect(games[0]).toHaveProperty("id");
        expect(games[0]).toHaveProperty("name");
        expect(games[0]).toHaveProperty("thumbnail");
        expect(games[0]).toHaveProperty("description");
        expect(games[0]).toHaveProperty("price");
        expect(games[0]).toHaveProperty("url");
    });

    test("getOwnedGames should handle invalid user ID gracefully", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1337);

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(0);
    });

    test("getOwnedGames should handle database errors gracefully", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValue(new Error("Database connection failed"));

        // Act & Assert
        await expect(gameService.getOwnedGames(1)).rejects.toThrow();
    });
});
