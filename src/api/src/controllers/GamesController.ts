import { IGameService } from "@api/interfaces/IGameService";
import { GameService } from "@api/services/GameService";
import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";
import { Request, Response } from "express";

/**
 * This controller is responsible for handling requests related to games.
 */
export class GamesController {
    private readonly _gameService: IGameService = new GameService();

    /**
     * Handles the request to get all games.
     *
     * @remarks This will later handle filtering and/or sorting.
     */
    public async getGames(req: Request, res: Response): Promise<void> {
        const options: GetGamesOptions = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            sort: req.query.sort ? (req.query.sort as "asc" | "desc") : undefined,
            sortBy: req.query.sortBy ? (req.query.sortBy as "name" | "price" | "created") : undefined,
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

        if (options.sortBy && !["name", "price", "created"].includes(options.sortBy)) {
            res.status(400).json({
                error: "Invalid sortBy value",
            });
            return;
        }

        const paginatedResult: PaginatedResponse<Game> = await this._gameService.getGames(options);
        res.json(paginatedResult);
    }

    /**
     * Handles the request to get all owned games for a user.
     */
    public async getOwnedGames(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const ownedGames: Game[] = await this._gameService.getOwnedGames(userId);

        res.json({
            games: ownedGames,
        });
    }
}
