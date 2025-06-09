// src/services/profileService.ts
import { IUser } from "@shared/types";

export interface Review {
    id: number;
    userId: number;
    gameId: number;
    gameName: string;
    gameThumbnail: string;
    rating: number;
    title: string;
    content: string;
    created: Date;
    updated?: Date;
    helpful: number;
}

class ProfileService {
    /**
     * Get current user's profile data
     */
    public async getCurrentUser(): Promise<IUser> {
        try {
            const url: string = `${VITE_API_URL}users/me`;
            const response: Response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies for session
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }

            const data: IUser = await response.json() as IUser;

            // Convert date strings to Date objects
            data.created = new Date(data.created);
            data.updated = new Date(data.updated);

            return data;
        }
        catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    public async updateProfile(userId: number, data: Partial<IUser>): Promise<IUser> {
        try {
            const url: string = `${VITE_API_URL}users/${userId}`;
            const response: Response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.statusText}`);
            }

            const updatedUser: IUser = await response.json() as IUser;

            // Convert date strings to Date objects
            updatedUser.created = new Date(updatedUser.created);
            updatedUser.updated = new Date(updatedUser.updated);

            return updatedUser;
        }
        catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    /**
     * Get user's reviews
     */
    public async getUserReviews(userId: number): Promise<Review[]> {
        try {
            const url: string = `${VITE_API_URL}users/${userId}/reviews`;
            const response: Response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch reviews: ${response.statusText}`);
            }

            const reviews: Review[] = await response.json() as Review[];

            // Convert date strings to Date objects
            return reviews.map(review => ({
                ...review,
                created: new Date(review.created),
                updated: review.updated ? new Date(review.updated) : undefined,
            }));
        }
        catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    }

    /**
     * Create a new review
     */
    public async createReview(gameId: number, reviewData: {
        rating: number;
        title: string;
        content: string;
    }): Promise<Review> {
        try {
            const url: string = `${VITE_API_URL}games/${gameId}/reviews`;
            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error(`Failed to create review: ${response.statusText}`);
            }

            const review: Review = await response.json() as Review;
            review.created = new Date(review.created);

            return review;
        }
        catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    }

    /**
     * Update a review
     */
    public async updateReview(reviewId: number, reviewData: {
        rating?: number;
        title?: string;
        content?: string;
    }): Promise<Review> {
        try {
            const url: string = `${VITE_API_URL}reviews/${reviewId}`;
            const response: Response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update review: ${response.statusText}`);
            }

            const review: Review = await response.json() as Review;
            review.created = new Date(review.created);
            review.updated = review.updated ? new Date(review.updated) : undefined;

            return review;
        }
        catch (error) {
            console.error("Error updating review:", error);
            throw error;
        }
    }

    /**
     * Delete a review
     */
    public async deleteReview(reviewId: number): Promise<void> {
        try {
            const url: string = `${VITE_API_URL}reviews/${reviewId}`;
            const response: Response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to delete review: ${response.statusText}`);
            }
        }
        catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    }

    /**
     * Update user address
     */
    public async updateAddress(userId: number, addressData: {
        street?: string;
        houseNumber?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    }): Promise<void> {
        try {
            const url: string = `${VITE_API_URL}users/${userId}/address`;
            const response: Response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(addressData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update address: ${response.statusText}`);
            }
        }
        catch (error) {
            console.error("Error updating address:", error);
            throw error;
        }
    }
}

// Create singleton instance
export const profileService: ProfileService = new ProfileService();
