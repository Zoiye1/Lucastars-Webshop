import { beforeEach, describe, expect, test, vi } from "vitest";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";
import { UserService } from "@api/services/UserService";
import { IUser } from "@shared/types";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("UserService", () => {
    test("getUserByUsername should return a User", async () => {
        // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([{
            id: 1,
            username: "Zoiye",
            email: "Zoiyevanleeuwen@icloud.com",
            firstName: "Zoiye",
            prefix: "van",
            lastName: "Leeuwen",
            street: "Ganzendiep",
            houseNumber: "4",
            postalCode: "1423DA",
            city: "Uithoorn",
            country: "Nederland",
            created: Date.now(),
            updated: Date.now(),
        }]);

        // Acts
        const user: IUser | undefined = await userService.getUserByUsername("Zoiye");

        // Asserts
        expect(user).toBeDefined();
        expect(user?.id).toBe(1);
        expect(user?.username).toBe("Zoiye");
    });

    test("getUserByUsername should return undefined if no User is to be found", async () => {
        // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Acts
        const user: IUser | undefined = await userService.getUserByUsername("Zoiye");

        // Asserts
        expect(user).toBeUndefined();
    });

    test("createUser should return a ", async () => {
        // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([{
            id: 1,
            username: "Zoiye",
            email: "Zoiyevanleeuwen@icloud.com",
            firstName: "Zoiye",
            prefix: "van",
            lastName: "Leeuwen",
            hashedPassword: "password",
        }]);

        // Acts
        const user: IUser | undefined = await userService.getUserByUsername("Zoiye");

        // Asserts
        expect(user).toBeUndefined();
    });
});
