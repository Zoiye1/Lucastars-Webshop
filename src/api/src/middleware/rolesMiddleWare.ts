import { NextFunction, Request, Response } from "express";

/**
 * Check if the User has the specific role, otherwise the user has no permission (403).
 */
export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.userId) {
            res.status(401).end();

            return;
        }

        if (!req.userRole) {
            res.status(401).end();

            return;
        }

        if (req.userRole !== role) {
            res.status(403).end();

            return;
        }

        next();
    };
}
