import { Cart } from "../../../shared/types";
import { DatabaseService } from "./DatabaseService";
import { PoolConnection } from "mysql2/promise";

export class CartService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async createCart(
        userId: number | undefined,
        gameId: number,
        quantity: number
    ): Promise<Cart[] | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            // const hashedPassword: string = password;
            await this._databaseService.query<Cart>(
                connection,
                `
                INSERT INTO cart_items (userId, gameId, quantity)
                VALUES (?, ?, ?)
                `,
                userId,
                gameId,
                quantity
            );
            return undefined;
        }
        catch (e: unknown) {
            throw new Error(`Failed to create user: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
