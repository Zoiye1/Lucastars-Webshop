import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { CheckoutItem } from "@shared/types";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";

export class CheckoutService implements ICheckoutService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getCheckout(_userId: number): Promise<CheckoutItem | null> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: CheckoutItem = (await this._databaseService.query<CheckoutItem[]>(
                connection,
                `
                SELECT 
                    cart_items.userId,
                    addresses.street,
                    addresses.houseNumber,
                    addresses.postalCode,
                    addresses.city,
                    SUM(games.price * cart_items.quantity) as 'totalPrice'
                FROM cart_items
                JOIN games ON games.id = cart_items.gameId
                JOIN addresses ON addresses.userId = cart_items.userId
                WHERE cart_items.userId = ?
                GROUP BY cart_items.userId
                `,
                1
            ))[0];

            result.totalPrice = Number(result.totalPrice);

            return result;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get checkout info: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
