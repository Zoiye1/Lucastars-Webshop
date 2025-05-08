import { IGameService } from "@api/interfaces/IGameService";
import { GameService } from "@api/services/GameService";
import { Game, PaginatedResponse } from "@shared/types";
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
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;

        if (page < 1) {
            res.status(400).json({
                error: "Page must be greater than 0",
            });
            return;
        }

        if (limit < 1) {
            res.status(400).json({
                error: "Limit must be greater than 0",
            });
            return;
        }

        const paginatedResult: PaginatedResponse<Game> = await this._gameService.getGames(page, limit);
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
