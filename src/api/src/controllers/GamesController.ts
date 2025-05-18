import { IGameService } from "@api/interfaces/IGameService";
import { GameService } from "@api/services/GameService";
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

    public async getGameById(req: Request, res: Response): Promise<void> {
        const id: number = Number(req.query.id as string);

        if (!id) {
            res.status(400).json({ error: "Missing 'id' parameter" });
            return;
        }

        const game: Game[] = await this._gameService.getGameById(id);
        res.status(200).json({ games: game });
    }

    public async getFiveRandomGames(_req: Request, res: Response): Promise<void> {
        const game: Game[] = await this._gameService.getFiveRandomGames();

        res.status(200).json({
            games: game,
        });
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

        // Check if we need to get a specific game or all owned games.
        const gameId: number | undefined = req.query.id ? Number(req.query.id) : undefined;

        const ownedGames: Game[] = await this._gameService.getOwnedGames(userId, gameId);

        res.json({
            games: ownedGames,
        });
    }

    /**
     * Handles the request to search for games.
     *
     * @remarks This will later be paginated.
     */
    public async searchGames(req: Request, res: Response): Promise<void> {
        const query: string | undefined = req.query.q as string || undefined;

        if (!query) {
            res.json({ games: [] });
            return;
        }

        const games: Game[] = await this._gameService.searchGames(query);
        res.json({ games });
    }
}
