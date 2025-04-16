import { DatabaseService } from "@api/services/DatabaseService";
import { PoolConnection } from "mysql2/promise";

/**
 * Seeder class to seed the database with test data.
 */
export abstract class Seeder {
    protected readonly _databaseService: DatabaseService;

    /**
     * The name of the table to seed.
     */
    protected abstract _tableName: string;

    /**
     * The columns of the table to seed.
     */
    protected abstract _tableColumns: string[];

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
    protected abstract getRecords(count: number): object[];

    /**
     * Seed the database with test data.
     *
     * @param count The number of records to generate.
     */
    public async seed(count: number = 10): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        const records: object[] = this.getRecords(count).map((record: object) =>
            Object.values(record as { [key: string]: object })
        );

        // If the records are empty, throw an error
        if (records.length === 0) {
            throw new Error("No records to insert");
        }

        // If the record keys dont match the table columns, throw an error
        const recordKeys: string[] = Object.keys(records[0]);
        if (recordKeys.length !== this._tableColumns.length) {
            throw new Error("Record keys do not match table columns");
        }

        try {
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 0");
            await this._databaseService.query(connection, `TRUNCATE TABLE \`${this._tableName}\``);
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 1");

            await this._databaseService.query(
                connection,
                `INSERT INTO \`${this._tableName}\`
                    (${this._tableColumns.join(", ")})
                VALUES
                    ?`,
                [...records]
            );
        }
        finally {
            connection.release();
        }
    }
}
