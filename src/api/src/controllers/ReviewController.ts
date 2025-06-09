// api/src/controllers/ReviewController.ts
import { Request, Response } from "express";
import { ReviewService } from "../services/ReviewService";
import { Review, ReviewCreateDTO, ReviewUpdateDTO } from "@shared/types";

export class ReviewController {
    private readonly _reviewService: ReviewService = new ReviewService();

    /**
     * Get all reviews for a specific user
     */
    public getUserReviews = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: number = parseInt(req.params.userId, 10);

            if (isNaN(userId)) {
                res.status(400).json({ error: "Invalid user ID" });
                return;
            }

            const reviews: Review[] = await this._reviewService.getReviewsByUserId(userId);
            res.status(200).json(reviews);
        }
        catch (error) {
            console.error("Error fetching user reviews:", error);
            res.status(500).json({ error: "Failed to fetch reviews" });
        }
    };

    /**
     * Get all reviews for a specific game
     */
    public getGameReviews = async (req: Request, res: Response): Promise<void> => {
        try {
            const gameId: number = parseInt(req.params.gameId, 10);

            if (isNaN(gameId)) {
                res.status(400).json({ error: "Invalid game ID" });
                return;
            }

            const reviews: Review[] = await this._reviewService.getReviewsByGameId(gameId);
            res.status(200).json(reviews);
        }
        catch (error) {
            console.error("Error fetching game reviews:", error);
            res.status(500).json({ error: "Failed to fetch reviews" });
        }
    };

    /**
     * Create a new review
     */
    public createReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const gameId: number = parseInt(req.params.gameId, 10);
            const userId: number = req.userId!; // From auth middleware

            if (isNaN(gameId)) {
                res.status(400).json({ error: "Invalid game ID" });
                return;
            }

            const reviewData: ReviewCreateDTO = req.body as ReviewCreateDTO;

            // Validate review data
            if (!reviewData.rating || !reviewData.title || !reviewData.content) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            if (reviewData.rating < 1 || reviewData.rating > 5) {
                res.status(400).json({ error: "Rating must be between 1 and 5" });
                return;
            }

            // Check if user already reviewed this game
            const existingReview: Review | undefined = await this._reviewService.getReviewByUserAndGame(userId, gameId);
            if (existingReview) {
                res.status(409).json({ error: "You have already reviewed this game" });
                return;
            }

            // Create the review
            const review: Review = await this._reviewService.createReview(
                userId,
                gameId,
                reviewData.rating,
                reviewData.title,
                reviewData.content
            );

            res.status(201).json(review);
        }
        catch (error) {
            console.error("Error creating review:", error);
            res.status(500).json({ error: "Failed to create review" });
        }
    };

    /**
     * Update an existing review
     */
    public updateReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const reviewId: number = parseInt(req.params.id, 10);
            const userId: number = req.userId!; // From auth middleware

            if (isNaN(reviewId)) {
                res.status(400).json({ error: "Invalid review ID" });
                return;
            }

            // Check if review exists and belongs to user
            const existingReview: Review | undefined = await this._reviewService.getReviewById(reviewId);
            if (!existingReview) {
                res.status(404).json({ error: "Review not found" });
                return;
            }

            if (existingReview.userId !== userId) {
                res.status(403).json({ error: "You can only edit your own reviews" });
                return;
            }

            const updateData: ReviewUpdateDTO = req.body as ReviewUpdateDTO;

            // Validate update data
            if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
                res.status(400).json({ error: "Rating must be between 1 and 5" });
                return;
            }

            // Update the review
            const updatedReview: Review = await this._reviewService.updateReview(
                reviewId,
                updateData
            );

            res.status(200).json(updatedReview);
        }
        catch (error) {
            console.error("Error updating review:", error);
            res.status(500).json({ error: "Failed to update review" });
        }
    };

    /**
     * Delete a review
     */
    public deleteReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const reviewId: number = parseInt(req.params.id, 10);
            const userId: number = req.userId!; // From auth middleware

            if (isNaN(reviewId)) {
                res.status(400).json({ error: "Invalid review ID" });
                return;
            }

            // Check if review exists and belongs to user
            const existingReview: Review | undefined = await this._reviewService.getReviewById(reviewId);
            if (!existingReview) {
                res.status(404).json({ error: "Review not found" });
                return;
            }

            if (existingReview.userId !== userId) {
                res.status(403).json({ error: "You can only delete your own reviews" });
                return;
            }

            // Delete the review
            await this._reviewService.deleteReview(reviewId);

            res.status(204).send();
        }
        catch (error) {
            console.error("Error deleting review:", error);
            res.status(500).json({ error: "Failed to delete review" });
        }
    };

    /**
     * Mark a review as helpful
     */
    public markReviewHelpful = async (req: Request, res: Response): Promise<void> => {
        try {
            const reviewId: number = parseInt(req.params.id, 10);

            if (isNaN(reviewId)) {
                res.status(400).json({ error: "Invalid review ID" });
                return;
            }

            await this._reviewService.incrementHelpfulCount(reviewId);
            res.status(200).json({ success: true });
        }
        catch (error) {
            console.error("Error marking review as helpful:", error);
            res.status(500).json({ error: "Failed to update review" });
        }
    };
}
