import { IUser } from "../../../shared/types";
import { DatabaseService } from "./DatabaseService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { hash, compare } from "bcrypt-ts";

type UserPasswordQueryResult = {
    password: string;
};

export class UserService {
    private readonly _databaseService: DatabaseService = new DatabaseService();
    private readonly SALT_ROUNDS: number = 10;

    private _getUserBaseQuery(): string {
        return `
            SELECT
                u.id,
                u.username,
                u.email,
                u.firstName,
                u.prefix,
                u.lastName,
                a.street,
                a.houseNumber,
                a.postalCode,
                a.city,
                a.country,
                u.created,
                u.updated
            FROM users u
            LEFT JOIN addresses a ON u.id = a.userId
        `;
    }

    public async getUserByUsername(username: string): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: IUser[] = await this._databaseService.query<IUser[]>(
                connection,
                `
                ${this._getUserBaseQuery()}
                WHERE u.username = ?
                `,
                username
            );
            if (result.length !== 1) {
                return undefined;
            }
            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Failed to get user by username: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async getUserByEmail(email: string): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: IUser[] = await this._databaseService.query<IUser[]>(
                connection,
                `
                ${this._getUserBaseQuery()}
                WHERE u.email = ?
                `,
                email
            );
            if (result.length !== 1) {
                return undefined;
            }
            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Failed to get user by email: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async getUserById(userId: number): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: IUser[] = await this._databaseService.query<IUser[]>(
                connection,
                `
                ${this._getUserBaseQuery()}
                WHERE u.id = ?
                `,
                userId
            );

            if (result.length !== 1) {
                return undefined;
            }

            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Failed to get user from session: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async createUser(
        username: string,
        email: string,
        firstName: string,
        prefix: string | undefined,
        lastName: string,
        password: string
    ): Promise<number | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            // Hash the password
            const hashedPassword: string = await hash(password, this.SALT_ROUNDS);
            // const hashedPassword: string = password;
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                INSERT INTO users (username, email, firstName, prefix, lastName, password)
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                username,
                email,
                firstName,
                prefix || null,
                lastName,
                hashedPassword
            );
            return result.insertId > 0 ? result.insertId : undefined;
        }
        catch (e: unknown) {
            throw new Error(`Failed to create user: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async verifyPassword(email: string, password: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: UserPasswordQueryResult[] = await this._databaseService.query<UserPasswordQueryResult[]>(
                connection,
                `
                SELECT password
                FROM users
                WHERE email = ?
                `,
                email
            );

            if (result.length !== 1) {
                return false;
            }

            const hashedPassword: string = result[0].password;

            return await compare(password, hashedPassword);
        }
        catch (error) {
            console.error("Password verification error:", error);
            return false;
        }
        finally {
            connection.release();
        }
    }
}
