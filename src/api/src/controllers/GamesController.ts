import { IGameService } from "@api/interfaces/IGamesService";
import { GameService } from "@api/services/GamesService";
import { Game } from "@shared/types";
import { Request, Response } from "express";

/**
 * This controller is responsible for handling requests related to games.
 */
export class GamesController {
    private readonly _gameService: IGameService = new GameService();

    /**
     * Handles the request to get all games.
     *
     * @remarks This will later be paginated and will handle filtering and/or sorting.
     */
    public async getGames(_req: Request, res: Response): Promise<void> {
        const games: Game[] = await this._gameService.getGames();

        res.json({
            games: games,
        });
    }
}
