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
            console.log("ProfileService: Fetching current user from:", `${VITE_API_URL}users/me`);

            const response: Response = await fetch(`${VITE_API_URL}users/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies for session
            });

            console.log("ProfileService: Response status:", response.status);
            console.log("ProfileService: Response ok:", response.ok);

            if (response.status === 401) {
                console.error("ProfileService: Authentication failed - user not logged in");
                const error: ApiError = new Error("Not authenticated. Please log in.");
                error.status = 401;
                throw error;
            }

            if (!response.ok) {
                console.error("ProfileService: API request failed:", response.status, response.statusText);
                const error: ApiError = new Error(`Failed to fetch user data: ${response.statusText}`);
                error.status = response.status;
                throw error;
            }

            const data: IUser = await response.json() as IUser;
            console.log("ProfileService: Raw user data received:", data);

            // Convert date strings to Date objects
            data.created = new Date(data.created);
            data.updated = new Date(data.updated);

            console.log("ProfileService: Processed user data:", data);
            return data;
        }
        catch (error: unknown) {
            console.error("ProfileService: Error in getCurrentUser:", error);

            // Add more specific error information
            if (error instanceof TypeError && error.message.includes("fetch")) {
                console.error("ProfileService: Network error - check if API server is running");
                console.error("ProfileService: API URL:", VITE_API_URL);
            }

            throw error;
        }
    }

    /**
     * Check if user is authenticated
     */
    public async checkAuth(): Promise<boolean> {
        try {
            console.log("ProfileService: Checking authentication at:", `${VITE_API_URL}auth/verify`);

            const response: Response = await fetch(`${VITE_API_URL}auth/verify`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            console.log("ProfileService: Auth check response:", response.ok);
            return response.ok;
        }
        catch (error: unknown) {
            console.error("ProfileService: Error checking auth:", error);
            return false;
        }
    }

    /**
     * Update user profile
     */
    public async updateProfile(userId: number, data: Partial<IUser>): Promise<IUser> {
        try {
            console.log("ProfileService: Updating profile for user:", userId, "with data:", data);

            // Separate user data and address data
            const { street, houseNumber, postalCode, city, country, ...userData } = data;

            // Update user data first if there's any user data to update
            if (Object.keys(userData).length > 0) {
                console.log("ProfileService: Updating user data:", userData);

                const response: Response = await fetch(`${VITE_API_URL}users/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(userData),
                });

                console.log("ProfileService: User update response:", response.status, response.ok);

                if (!response.ok) {
                    const error: ApiError = new Error(`Failed to update profile: ${response.statusText}`);
                    error.status = response.status;
                    throw error;
                }
            }

            // Update address if any address fields were provided
            const addressData: Partial<IUser> = { street, houseNumber, postalCode, city, country };
            const addressFields: (string | null | undefined)[] = [street, houseNumber, postalCode, city, country];
            const hasAddressData: boolean = addressFields.some(value => value !== undefined);

            if (hasAddressData) {
                console.log("ProfileService: Updating address data:", addressData);
                await this.updateAddress(userId, addressData);
            }

            // Fetch and return the updated user
            console.log("ProfileService: Fetching updated user data");
            return await this.getCurrentUser();
        }
        catch (error: unknown) {
            console.error("ProfileService: Error updating profile:", error);
            throw error;
        }
    }

    /**
     * Update user address
     */
    public async updateAddress(userId: number, addressData: Partial<IUser>): Promise<void> {
        try {
            console.log("ProfileService: Updating address for user:", userId, "with data:", addressData);

            // Filter address data to only include address fields and convert null to undefined
            const filteredAddressData: Record<string, string | null> = {};

            if (addressData.street !== undefined) {
                filteredAddressData.street = addressData.street || null;
            }
            if (addressData.houseNumber !== undefined) {
                filteredAddressData.houseNumber = addressData.houseNumber || null;
            }
            if (addressData.postalCode !== undefined) {
                filteredAddressData.postalCode = addressData.postalCode || null;
            }
            if (addressData.city !== undefined) {
                filteredAddressData.city = addressData.city || null;
            }
            if (addressData.country !== undefined) {
                filteredAddressData.country = addressData.country || null;
            }

            console.log("ProfileService: Filtered address data:", filteredAddressData);

            const response: Response = await fetch(`${VITE_API_URL}users/${userId}/address`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(filteredAddressData),
            });

            console.log("ProfileService: Address update response:", response.status, response.ok);

            if (!response.ok) {
                const error: ApiError = new Error(`Failed to update address: ${response.statusText}`);
                error.status = response.status;
                throw error;
            }
        }
        catch (error: unknown) {
            console.error("ProfileService: Error updating address:", error);
            throw error;
        }
    }
}

// Create singleton instance
export const profileService: ProfileService = new ProfileService();
