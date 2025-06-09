import { UserService } from "@api/services/UserService";
import { IUser } from "@shared/types";
import { NextFunction, Request, Response } from "express";

const userService: UserService = new UserService();

/**
 * Check if the User has the specific role, otherwise the user has no permission (403).
 */
export function requireRole(role: string) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!req.userId) {
            res.status(401).end();

            return;
        }

        const user: IUser | undefined = await userService.getUserById(req.userId);

        if (!user) {
            res.status(401).end();

            return;
        }

        // If the user does not have the admin role, return 403 Forbidden
        if (!user.role || user.role !== role) {
            res.status(403).end();

            return;
        }

        next();
    };
}
