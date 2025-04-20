import { IOrdersGamesService } from "@api/interfaces/IOrdersGamesService";
import { OrdersGameService } from "@api/services/OrdersGamesService";
import { Game } from "@shared/types";
import { Request, Response } from "express";

/**
 * This controller is responsible for handling requests related to games.
 */
export class OrdersGamesController {
    private readonly _gameService: IGamesService = new GameService();

    /**
     * Handles the request to get all games.
     *
     * @remarks This will later be paginated and will handle filtering and/or sorting.
     */
    public async getOrdersGames(_req: Request, res: Response): Promise<void> {
        const games: Game[] = await this._gameService.getGames();

        res.json({
            games: games,
        });
    }
}
