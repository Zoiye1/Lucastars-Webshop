import { beforeEach, describe, expect, test, vi } from "vitest";
import { CartService } from "@api/services/CartService";
import { CartItem } from "@shared/types";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("CartService", () => {
    test("getCart geeft een array met cart items terug", async () => {
        const cartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        const mockCartItems: CartItem[] = [
            { userId: 1, gameId: 2, name: "Game 2", thumbnail: "thumb.jpg", price: 10, quantity: 1, description: "" },
        ];
        mockDatabaseService.query.mockResolvedValue(mockCartItems);

        const result = await cartService.getCart(1);

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveProperty("userId");
        expect(result[0]).toHaveProperty("gameId");
    });

    test("getCart geeft lege array als er geen items zijn", async () => {
        const cartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        const result = await cartService.getCart(99);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    test("getCart gooit een error bij database fout", async () => {
        const cartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValue(new Error("DB error"));

        await expect(cartService.getCart(1)).rejects.toThrow();
    });
});
