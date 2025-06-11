import { ITagService } from "@api/interfaces/ITagService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Tag } from "@shared/types";

/**
 * Service to retrieve games from the database.
 */
export class TagService implements ITagService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getTags(): Promise<Tag[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: Tag[] = await this._databaseService.query<Tag[]>(
                connection,
                `
                SELECT
                    t.id,
                    t.value
                FROM tags t
                ORDER BY t.value
                `
            );

            return result;
        }
        catch (error) {
            throw new Error(`Failed to get tags from the database: ${error}`);
        }
        finally {
            connection.release();
        }
    }

    public async getTagById(id: number): Promise<Tag | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: Tag[] = await this._databaseService.query<Tag[]>(
                connection,
                `
                SELECT
                    t.id,
                    t.value
                FROM tags t
                WHERE t.id = ?
                `,
                id
            );

            return result.at(0);
        }
        catch (error) {
            throw new Error(`Failed to get tag by ID from the database: ${error}`);
        }
        finally {
            connection.release();
        }
    }

    public async createTag(tag: Tag): Promise<Tag> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                INSERT INTO tags (value)
                VALUES (?)
                `,
                tag.value
            );

            tag.id = result.insertId;
            return tag;
        }
        catch (error) {
            throw new Error(`Failed to create tag in the database: ${error}`);
        }
        finally {
            connection.release();
        }
    }

    public async updateTag(tag: Tag): Promise<Tag> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                UPDATE tags
                SET value = ?
                WHERE id = ?
                `,
                tag.value,
                tag.id
            );

            return tag;
        }
        catch (error) {
            throw new Error(`Failed to update tag in the database: ${error}`);
        }
        finally {
            connection.release();
        }
    }

    public async deleteTag(id: number): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                DELETE FROM tags
                WHERE id = ?
                `,
                id
            );
        }
        catch (error) {
            throw new Error(`Failed to delete tag from the database: ${error}`);
        }
        finally {
            connection.release();
        }
    }
}
