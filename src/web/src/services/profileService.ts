// src/web/services/profileService.ts
import { IUser } from "@shared/types";

declare const VITE_API_URL: string;

interface ApiError extends Error {
    status?: number;
}

class ProfileService {
    /**
     * Get current user's profile data
     */
    public async getCurrentUser(): Promise<IUser> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}users/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies for session
            });

            if (response.status === 401) {
                const error: ApiError = new Error("Not authenticated. Please log in.");
                error.status = 401;
                throw error;
            }

            if (!response.ok) {
                const error: ApiError = new Error(`Failed to fetch user data: ${response.statusText}`);
                error.status = response.status;
                throw error;
            }

            const data: IUser = await response.json() as IUser;

            // Convert date strings to Date objects
            data.created = new Date(data.created);
            data.updated = new Date(data.updated);

            return data;
        }
        catch (error: unknown) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }

    /**
     * Check if user is authenticated
     */
    public async checkAuth(): Promise<boolean> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}auth/verify`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            return response.ok;
        }
        catch (error: unknown) {
            console.error("Error checking auth:", error);
            return false;
        }
    }

    /**
     * Update user profile
     */
    public async updateProfile(userId: number, data: Partial<IUser>): Promise<IUser> {
        try {
            // Separate user data and address data
            const { street, houseNumber, postalCode, city, country, ...userData } = data;

            // Update user data first if there's any user data to update
            if (Object.keys(userData).length > 0) {
                const response: Response = await fetch(`${VITE_API_URL}users/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(userData),
                });

                if (!response.ok) {
                    const error: ApiError = new Error(`Failed to update profile: ${response.statusText}`);
                    error.status = response.status;
                    throw error;
                }
            }

            // Update address if any address fields were provided
            const addressData: Partial<IUser> = { street, houseNumber, postalCode, city, country };
            const addressFields = [street, houseNumber, postalCode, city, country];
            const hasAddressData: boolean = addressFields.some(value => value !== undefined);

            if (hasAddressData) {
                await this.updateAddress(userId, addressData);
            }

            // Fetch and return the updated user
            return await this.getCurrentUser();
        }
        catch (error: unknown) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    /**
     * Update user address
     */
    public async updateAddress(userId: number, addressData: Partial<IUser>): Promise<void> {
        try {
            // Filter address data to only include address fields and convert null to undefined
            const filteredAddressData: Record<string, string | undefined> = {};

            if (addressData.street !== undefined) {
                filteredAddressData.street = addressData.street || undefined;
            }
            if (addressData.houseNumber !== undefined) {
                filteredAddressData.houseNumber = addressData.houseNumber || undefined;
            }
            if (addressData.postalCode !== undefined) {
                filteredAddressData.postalCode = addressData.postalCode || undefined;
            }
            if (addressData.city !== undefined) {
                filteredAddressData.city = addressData.city || undefined;
            }
            if (addressData.country !== undefined) {
                filteredAddressData.country = addressData.country || undefined;
            }

            const response: Response = await fetch(`${VITE_API_URL}users/${userId}/address`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(filteredAddressData),
            });

            if (!response.ok) {
                const error: ApiError = new Error(`Failed to update address: ${response.statusText}`);
                error.status = response.status;
                throw error;
            }
        }
        catch (error: unknown) {
            console.error("Error updating address:", error);
            throw error;
        }
    }
}

// Create singleton instance
export const profileService: ProfileService = new ProfileService();
