import { IGameService } from "@api/interfaces/IGameService";
import { GameImageService } from "@api/services/GameImageService";
import { GameService } from "@api/services/GameService";
import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";
import { Request, Response } from "express";

/**
 * This controller is responsible for handling requests related to games.
 */
export class GamesController {
    private readonly _gameService: IGameService = new GameService();
    private readonly _gameImageService: GameImageService = new GameImageService();

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
            sortBy: req.query.sortBy ? (req.query.sortBy as string) : undefined,
            tags: req.query.tags ? (req.query.tags as string).split(",").map(Number) : undefined,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
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

        if (options.sortBy && !["id", "sku", "name", "price", "created"].includes(options.sortBy)) {
            res.status(400).json({
                error: "Invalid sortBy value",
            });
            return;
        }

        if (options.tags && options.tags.length > 0) {
            for (const tag of options.tags) {
                if (isNaN(tag)) {
                    res.status(400).json({
                        error: "Invalid tag value",
                    });
                    return;
                }
            }
        }

        if (options.minPrice && isNaN(options.minPrice)) {
            res.status(400).json({
                error: "Invalid minPrice value",
            });
            return;
        }

        if (options.maxPrice && isNaN(options.maxPrice)) {
            res.status(400).json({
                error: "Invalid maxPrice value",
            });
            return;
        }

        const paginatedResult: PaginatedResponse<Game> = await this._gameService.getGames(options);
        res.json(paginatedResult);
    }

    public async getGameById(req: Request, res: Response): Promise<void> {
        const id: number = Number(req.query.id as string);

        if (!id) {
            res.status(400).json({ error: "Missing 'id' parameter" });
            return;
        }

        const withPlayUrl: boolean = req.query.withPlayUrl === "true";

        if (withPlayUrl && (!req.userId || !req.userId || req.userRole !== "admin")) {
            res.status(401).json({ error: "Unauthorized to access play URL" });
            return;
        }

        const game: Game[] = await this._gameService.getGameById(id, withPlayUrl);
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

    public async updateGame(req: Request, res: Response): Promise<void> {
        // Check if the user is an admin.
        if (!req.userId || req.userRole !== "admin") {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!req.fields || !req.fields.game) {
            res.status(400).json({ error: "Missing game data" });
            return;
        }

        const game: Game | undefined = JSON.parse(req.fields.game as unknown as string) as Game | undefined;

        if (!game) {
            res.status(400).json({ error: "Invalid game data" });
            return;
        }

        if (
            typeof game.id !== "number" ||
            typeof game.sku !== "string" ||
            typeof game.name !== "string" ||
            typeof game.description !== "string" ||
            typeof game.price !== "number" ||
            !Array.isArray(game.tags) ||
            !game.tags.every(tag => typeof tag === "string")
        ) {
            res.status(400).json({ error: "Invalid game structure" });
            return;
        }

        // Check if the thumbnail is a valid image file. Only allow jpeg and png formats.
        const allowedImageTypes: string[] = [
            "image/jpeg",
            "image/png",
        ];

        if (!req.files || !req.files.thumbnail || req.files.thumbnail.length !== 1) {
            res.status(400).json({ error: "Missing thumbnail file" });
            return;
        }

        if (!req.files.thumbnail[0].mimetype || !allowedImageTypes.includes(req.files.thumbnail[0].mimetype)) {
            res.status(400).json({ error: "Invalid thumbnail file type. Only jpeg and png are allowed." });
            return;
        }

        if (req.files.images) {
            if (!Array.isArray(req.files.images)) {
                res.status(400).json({ error: "Images must be an array" });
                return;
            }

            // Check if the images are valid image files. Only allow jpeg and png formats.
            for (const image of req.files.images) {
                if (!image.mimetype || !allowedImageTypes.includes(image.mimetype)) {
                    res.status(400).json({ error: "Invalid image file type. Only jpeg and png are allowed." });
                    return;
                }
            }
        }

        // Delete all images. Kinda hacky since its not efficient, but for now it works.
        await this._gameImageService.deleteImages(game.id);

        // Upload the thumbnail.
        game.thumbnail = await this._gameImageService.uploadImage(game.id, req.files.thumbnail[0]);

        // Upload the images.
        game.images = req.files.images
            ? await Promise.all(req.files.images.map(image => this._gameImageService.uploadImage(game.id, image)))
            : [];

        await this._gameService.updateGame(game);

        res.status(200).json({
            message: "Game updated successfully",
            game: game,
        });
    }
}
