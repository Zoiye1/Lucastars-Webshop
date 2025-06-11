import { UserService } from "@api/services/UserService";
import { IUser, PaginatedResponse, PaginationOptions, PaginationSortOptions } from "@shared/types";
import { Request, Response } from "express";

export class UserController {
    private readonly _userService: UserService = new UserService();

    public async getUsers(req: Request, res: Response): Promise<void> {
        const options: PaginationOptions & PaginationSortOptions = {
            page: parseInt(req.query.page as string, 10) || 1,
            limit: parseInt(req.query.limit as string, 10) || 10,
            sort: req.query.sort ? (req.query.sort as "asc" | "desc") : undefined,
            sortBy: req.query.sortBy ? (req.query.sortBy as string) : undefined,
        };

        if (options.page < 1) {
            res.status(400).json({
                error: "Page must be greater than 0",
            });
            return;
        }

        if (options.limit < 1) {
            res.status(400).json({
                error: "Limit must be greater than 0",
            });
            return;
        }

        if (options.sort && !["asc", "desc"].includes(options.sort)) {
            res.status(400).json({
                error: "Invalid sort value",
            });
            return;
        }

        if (options.sortBy && !["id", "email", "username", "name", "role", "created"].includes(options.sortBy)) {
            res.status(400).json({
                error: "Invalid sortBy value",
            });
            return;
        }

        const paginatedResult: PaginatedResponse<IUser> = await this._userService.getUsers(options);
        res.json(paginatedResult);
    }

    public async toggleAdminRole(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.id;

        const updatedRole: IUser = await this._userService.toggleAdminRole(userId);

        res.json(updatedRole);
    }
}
