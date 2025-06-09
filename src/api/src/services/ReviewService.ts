// api/src/services/ReviewService.ts
import { DatabaseService } from "./DatabaseService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { Review, ReviewUpdateDTO } from "@shared/types";

export class ReviewService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    /**
     * Get all reviews for a specific user
     */
    public async getReviewsByUserId(userId: number): Promise<Review[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: Review[] = await this._databaseService.query<Review[]>(
                connection,
                `
                SELECT 
                    r.id,
                    r.user_id as userId,
                    r.game_id as gameId,
                    g.name as gameName,
                    g.thumbnail as gameThumbnail,
                    r.rating,
                    r.title,
                    r.content,
                    r.helpful,
                    r.created_at as created,
                    r.updated_at as updated
                FROM reviews r
                INNER JOIN games g ON r.game_id = g.id
                WHERE r.user_id = ?
                ORDER BY r.created_at DESC
                `,
                userId
            );
            return result;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get reviews by user ID: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Get all reviews for a specific game
     */
    public async getReviewsByGameId(gameId: number): Promise<Review[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: Review[] = await this._databaseService.query<Review[]>(
                connection,
                `
                SELECT 
                    r.id,
                    r.user_id as userId,
                    r.game_id as gameId,
                    u.username,
                    u.firstName,
                    u.lastName,
                    r.rating,
                    r.title,
                    r.content,
                    r.helpful,
                    r.created_at as created,
                    r.updated_at as updated
                FROM reviews r
                INNER JOIN users u ON r.user_id = u.id
                WHERE r.game_id = ?
                ORDER BY r.helpful DESC, r.created_at DESC
                `,
                gameId
            );
            return result;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get reviews by game ID: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Get a specific review by ID
     */
    public async getReviewById(reviewId: number): Promise<Review | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: Review[] = await this._databaseService.query<Review[]>(
                connection,
                `
                SELECT 
                    r.id,
                    r.user_id as userId,
                    r.game_id as gameId,
                    g.name as gameName,
                    g.thumbnail as gameThumbnail,
                    r.rating,
                    r.title,
                    r.content,
                    r.helpful,
                    r.created_at as created,
                    r.updated_at as updated
                FROM reviews r
                INNER JOIN games g ON r.game_id = g.id
                WHERE r.id = ?
                `,
                reviewId
            );
            return result.length > 0 ? result[0] : undefined;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get review by ID: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Get a review by user and game (to check if user already reviewed)
     */
    public async getReviewByUserAndGame(userId: number, gameId: number): Promise<Review | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: Review[] = await this._databaseService.query<Review[]>(
                connection,
                `
                SELECT 
                    r.id,
                    r.user_id as userId,
                    r.game_id as gameId,
                    r.rating,
                    r.title,
                    r.content,
                    r.helpful,
                    r.created_at as created,
                    r.updated_at as updated
                FROM reviews r
                WHERE r.user_id = ? AND r.game_id = ?
                `,
                userId,
                gameId
            );
            return result.length > 0 ? result[0] : undefined;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get review by user and game: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Create a new review
     */
    public async createReview(
        userId: number,
        gameId: number,
        rating: number,
        title: string,
        content: string
    ): Promise<Review> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                INSERT INTO reviews (user_id, game_id, rating, title, content)
                VALUES (?, ?, ?, ?, ?)
                `,
                userId,
                gameId,
                rating,
                title,
                content
            );

            if (result.insertId === 0) {
                throw new Error("Failed to create review");
            }

            // Return the created review
            const createdReview: Review | undefined = await this.getReviewById(result.insertId);
            if (!createdReview) {
                throw new Error("Failed to retrieve created review");
            }

            return createdReview;
        }
        catch (e: unknown) {
            throw new Error(`Failed to create review: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Update an existing review
     */
    public async updateReview(reviewId: number, updateData: ReviewUpdateDTO): Promise<Review> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            // Build dynamic update query based on provided fields
            const updateFields: string[] = [];
            const values: any[] = [];

            if (updateData.rating !== undefined) {
                updateFields.push("rating = ?");
                values.push(updateData.rating);
            }
            if (updateData.title !== undefined) {
                updateFields.push("title = ?");
                values.push(updateData.title);
            }
            if (updateData.content !== undefined) {
                updateFields.push("content = ?");
                values.push(updateData.content);
            }

            if (updateFields.length === 0) {
                throw new Error("No fields to update");
            }

            // Add reviewId at the end for WHERE clause
            values.push(reviewId);

            await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                UPDATE reviews 
                SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                ...values
            );

            // Return the updated review
            const updatedReview: Review | undefined = await this.getReviewById(reviewId);
            if (!updatedReview) {
                throw new Error("Failed to retrieve updated review");
            }

            return updatedReview;
        }
        catch (e: unknown) {
            throw new Error(`Failed to update review: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Delete a review
     */
    public async deleteReview(reviewId: number): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                "DELETE FROM reviews WHERE id = ?",
                reviewId
            );
        }
        catch (e: unknown) {
            throw new Error(`Failed to delete review: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Increment the helpful count for a review
     */
    public async incrementHelpfulCount(reviewId: number): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                "UPDATE reviews SET helpful = helpful + 1 WHERE id = ?",
                reviewId
            );
        }
        catch (e: unknown) {
            throw new Error(`Failed to increment helpful count: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Get review statistics for a user
     */
    public async getUserReviewStats(userId: number): Promise<{
        totalReviews: number;
        averageRating: number;
        totalHelpful: number;
    }> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: any[] = await this._databaseService.query<any[]>(
                connection,
                `
                SELECT 
                    COUNT(*) as totalReviews,
                    AVG(rating) as averageRating,
                    SUM(helpful) as totalHelpful
                FROM reviews
                WHERE user_id = ?
                `,
                userId
            );

            return {
                totalReviews: result[0].totalReviews || 0,
                averageRating: result[0].averageRating || 0,
                totalHelpful: result[0].totalHelpful || 0,
            };
        }
        catch (e: unknown) {
            throw new Error(`Failed to get review stats: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
