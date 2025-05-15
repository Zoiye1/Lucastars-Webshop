import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { CheckoutItem } from "@shared/types";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";

export class CheckoutService implements ICheckoutService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getCheckout(userId: number): Promise<CheckoutItem | null> {
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
                userId
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

    public async postCheckout(userId: number, item: CheckoutItem): Promise<CheckoutItem | null> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // 1. Upsert address using INSERT ... ON DUPLICATE KEY UPDATE
            await this._databaseService.query(connection,
                `
                INSERT INTO addresses (userId, street, houseNumber, postalCode, city, country, \`default\`)
                VALUES (?, ?, ?, ?, ?, 'Netherlands', true)
                ON DUPLICATE KEY UPDATE
                    street = VALUES(street),
                    houseNumber = VALUES(houseNumber),
                    postalCode = VALUES(postalCode),
                    city = VALUES(city)
                `,
                userId, item.street, item.houseNumber, item.postalCode, item.city
            );

            // 2. Get total price from cart
            const cartTotalRows: unknown = await this._databaseService.query(connection,
                `
                SELECT SUM(games.price * cart_items.quantity) as totalPrice
                FROM cart_items
                JOIN games ON games.id = cart_items.gameId
                WHERE cart_items.userId = ?
                `,
                [userId]
            );
            const totalPrice = Number(cartTotalRows[0]?.totalPrice || 0);

            if (totalPrice === 0) {
                throw new Error("Cart is empty or total price is zero.");
            }

            // 3. Insert order
            const [orderResult]: unknown = await this._databaseService.query(connection,
                `
                INSERT INTO orders (userId, addressId, orderDate, status, totalAmount)
                VALUES (?, ?, NOW(), 'pending', ?)
                `,
                [userId, addressId, totalPrice]
            );
            const orderId = orderResult.insertId;

            // 4. Insert into orders_games using cart_items directly
            const [cartItems]: any = await this._databaseService.query(connection,
                `
                SELECT cart_items.gameId, cart_items.quantity, games.price
                FROM cart_items
                JOIN games ON games.id = cart_items.gameId
                WHERE cart_items.userId = ?
                `,
                [userId]
            );

            for (const cartItem of cartItems) {
                await this._databaseService.query(connection,
                    `
                    INSERT INTO orders_games (orderId, gameId, price)
                    VALUES (?, ?, ?)
                    `,
                    orderId,
                    cartItem.gameId,
                    cartItem.price,
                );
            }

            // 5. Clear user's cart
            await this._databaseService.query(connection,
                "DELETE FROM cart_items WHERE userId = ?",
                userId
            );

            // Return the checkout info
            return {
                street: item.street,
                houseNumber: item.houseNumber,
                postalCode: item.postalCode,
                city: item.city,
                totalPrice,
            };
        }
        catch (e: unknown) {
            throw new Error(`Failed to get checkout info: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
