import { DatabaseService } from "@api/services/DatabaseService";
import { PoolConnection } from "mysql2/promise";

type IdQueryResult = {
    id: number;
};

/**
 * Seeder class to seed the database with test data.
 *
 * @remarks The template type T should have all the columns of the table to seed.
 */
export abstract class Seeder<T extends Record<string, unknown>> {
    protected readonly _databaseService: DatabaseService;

    /**
     * The name of the table to seed.
     */
    protected abstract _table: string;

    /**
     * Constructor for the Seeder class.
     *
     * @param databaseService The DatabaseService instance to use for database operations.
     */
    public constructor(databaseService: DatabaseService = new DatabaseService()) {
        this._databaseService = databaseService;
    }

    /**
     * Get the records to seed the database with.
     *
     * @param count The number of records to generate.
     * @remarks return type should match the table columns defined in `_tableColumns`
     */
    protected abstract getRecords(count: number): SyncOrAsync<T[]>;

    /**
     * Seed the database with test data.
     *
     * @param count The number of records to generate.
     */
    public async seed(count: number): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        const records: T[] = await this.getRecords(count);

        if (records.length === 0) {
            throw new Error("No records to insert");
        }

        try {
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 0");
            await this._databaseService.query(connection, `TRUNCATE TABLE \`${this._table}\``);
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 1");

            const columns: string[] = Object.keys(records[0]);
            const values: unknown[] = records.map(record => Object.values(record));

            await this._databaseService.query(
                connection,
                `INSERT INTO \`${this._table}\`
                    (${columns.join(", ")})
                VALUES
                    ?`,
                [...values]
            );
        }
        finally {
            connection.release();
        }
    }

    /**
     * Get the existing ids from the database.
     *
     * @returns The existing game IDs.
     */
    protected async getExistingIds(table: string): Promise<number[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const rows: IdQueryResult[] = await this._databaseService.query<IdQueryResult[]>(
                connection,
                `SELECT \`id\` FROM \`${table}\``
            );

            return rows.map(row => row.id);
        }
        finally {
            connection.release();
        }
    }
}
