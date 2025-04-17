import { DatabaseService } from "@api/services/DatabaseService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

/**
 * Seeder class to seed the database with test data.
 *
 * @remarks The template type T should have all the columns of the table to seed.
 */
export abstract class Seeder<T extends { id?: number }> {
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
    protected abstract getRecords(count: number, ...recordIds: number[][]): SyncOrAsync<T[]>;

    /**
     * Seed the database with test data.
     *
     * @param count The number of records to generate.
     * @param recordIds The ids of the records to use for seeding. This is optional.
     */
    public async seed(count: number, ...recordIds: number[][]): Promise<T[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        const records: T[] = await this.getRecords(count, ...recordIds);

        if (records.length === 0) {
            throw new Error("No records to insert");
        }

        try {
            const columns: string[] = Object.keys(records[0]);
            const values: unknown[] = records.map(record => Object.values(record));

            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `INSERT INTO \`${this._table}\`
                    (${columns.join(", ")})
                VALUES
                    ?`,
                [...values]
            );

            // If the number of affected rows does not equal the amount of records, throw an error
            if (result.affectedRows !== records.length) {
                throw new Error(`Failed to insert ${records.length} records`);
            }

            // We set the id that we got from the database to the records
            for (let i: number = 0; i < records.length; i++) {
                records[i].id = result.insertId + i;
            }

            return records;
        }
        finally {
            connection.release();
        }
    }

    /**
     * Truncates the table.
     *
     * @remarks This action is descructive and will remove all data from the table.
     */
    public async truncate(): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 0");
            await this._databaseService.query(connection, `TRUNCATE TABLE \`${this._table}\``);
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 1");
        }
        finally {
            connection.release();
        }
    }
}
