// api/src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { IUser } from "@shared/types";

interface UpdateUserRequest {
    firstName?: string;
    prefix?: string;
    lastName?: string;
}

interface UpdateAddressRequest {
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export class UserController {
    private readonly _userService: UserService = new UserService();

    /**
     * Get current user
     */
    public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: number | undefined = req.userId; // From auth middleware

            if (!userId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }

            const user: IUser | undefined = await this._userService.getUserById(userId);

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            res.status(200).json(user);
        }
        catch (error: unknown) {
            console.error("Error fetching current user:", error);
            res.status(500).json({ error: "Failed to fetch user data" });
        }
    };

    /**
     * Update user
     */
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const requestingUserId: number | undefined = req.userId;

            // Check if user is updating their own profile
            if (!requestingUserId || requestingUserId !== userId) {
                res.status(403).json({ error: "You can only update your own profile" });
                return;
            }

            const updateData: UpdateUserRequest = req.body;

            // Only allow updating certain fields
            const allowedFields: (keyof UpdateUserRequest)[] = ["firstName", "prefix", "lastName"];
            const filteredData: Partial<IUser> = {};

            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    (filteredData as any)[field] = updateData[field];
                }
            }

            const success: boolean = await this._userService.updateUser(userId, filteredData);

            if (!success) {
                res.status(500).json({ error: "Failed to update user" });
                return;
            }

            // Return updated user
            const updatedUser: IUser | undefined = await this._userService.getUserById(userId);
            res.status(200).json(updatedUser);
        }
        catch (error: unknown) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: "Failed to update user" });
        }
    };

    /**
     * Update user address
     */
    public updateAddress = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const requestingUserId: number | undefined = req.userId;

            // Check if user is updating their own address
            if (!requestingUserId || requestingUserId !== userId) {
                res.status(403).json({ error: "You can only update your own address" });
                return;
            }

            const addressData: UpdateAddressRequest = req.body;

            // Validate address fields
            const allowedFields: (keyof UpdateAddressRequest)[] = ["street", "houseNumber", "postalCode", "city", "country"];
            const filteredData: Record<string, string | null> = {};

            for (const field of allowedFields) {
                if (addressData[field] !== undefined) {
                    filteredData[field] = addressData[field] || null;
                }
            }

            const success: boolean = await this._userService.updateUserAddress(userId, filteredData);

            if (!success) {
                res.status(500).json({ error: "Failed to update address" });
                return;
            }

            res.status(200).json({ success: true });
        }
        catch (error: unknown) {
            console.error("Error updating address:", error);
            res.status(500).json({ error: "Failed to update address" });
        }
    };
}
