import { IUser } from "../../../shared/types";
import { DatabaseService } from "./DatabaseService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import * as bcrypt from "bcrypt";

type UserQueryResult = {
    id: number;
    username: string;
    email: string;
    firstName: string;
    prefix: string | null;
    lastName: string;
    password: string;
    created: Date;
    updated: Date;
};

export class UserService {
    private readonly _databaseService: DatabaseService = new DatabaseService();
    private readonly SALT_ROUNDS: number = 10;

    public async getUserByEmail(email: string): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: UserQueryResult[] = await this._databaseService.query<UserQueryResult[]>(
                connection,
                `
                SELECT id, username, email, firstName, prefix, lastName, password, created, updated
                FROM users
                WHERE email = ?
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

    public async getUserByUsername(username: string): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: UserQueryResult[] = await this._databaseService.query<UserQueryResult[]>(
                connection,
                `
                SELECT id, username, email, firstName, prefix, lastName, password, created, updated
                FROM users
                WHERE username = ?
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
            const hashedPassword: string = await bcrypt.hash(password, this.SALT_ROUNDS);

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
}
