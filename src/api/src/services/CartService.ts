import { ICartService } from "@api/interfaces/ICartService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { CartItem } from "@shared/types";

export class CartService implements ICartService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getCart(_userId: number): Promise<CartItem[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // eslint-disable-next-line @typescript-eslint/typedef
            const result = await this._databaseService.query<CartItem[]>(
                connection,
                `
                SELECT userId, gameId, quantity, 1 AS 'price'
                FROM cart_items
                WHERE userId = ?
                `,
                1
            );

            return result;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get cart: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async updateCart(userId: number, items: CartItem[]): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            await connection.beginTransaction();

            // Eerst alles verwijderen voor deze gebruiker
            await this._databaseService.query<ResultSetHeader>(
                connection,
                "DELETE FROM cart_items WHERE userId = ?",
                userId
            );

            // Voeg nieuwe items toe
            for (const item of items) {
                await this._databaseService.query<ResultSetHeader>(
                    connection,
                    `
                    INSERT INTO cart_items (userId, gameId, quantity)
                    VALUES (?, ?, ?)

                    `,

                    item.userId,
                    item.gameId,
                    item.quantity
                );
            }

            await connection.commit();
        }
        catch (e: unknown) {
            await connection.rollback();
            throw new Error(`Failed to update cart: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async clearCart(userId: number): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                "DELETE FROM cart_items WHERE userId = ?",
                userId
            );
        }
        catch (e: unknown) {
            throw new Error(`Failed to clear cart: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}

// // import { CartItem } from "@shared/types";

// // export class CartService implements ICartService {
// //    private carts: Map<number, CartItem[]> = new Map([
//         [1, [
//             {
//                 name: "T-shirt",
//                 price: 19.99,
//                 image: "https://example.com/images/tshirt.jpg",
//                 description: "Comfortabel katoenen T-shirt in verschillende maten.",
//                 quantity: 2,
//             },
//             {
//                 name: "Cap",
//                 price: 9.99,
//                 image: "https://example.com/images/cap.jpg",
//                 description: "Stijlvolle pet, perfect voor zonnige dagen.",
//                 quantity: 1,
//             },
//         ]],
//    ]);

// //    public getCart(userId: number): CartItem[] {
// //       return this.carts.get(userId) ?? [];
//     }

// //   public updateCart(userId: number, items: CartItem[]): void {
// //       this.carts.set(userId, items);
//     }
// }
