import { Game, PaginatedResponse } from "@shared/types";

export abstract class IGameService {
    public abstract getGames(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: "name" | "price" | "created",
        tags?: number[],
        minPrice?: number,
        maxPrice?: number
    ): Promise<PaginatedResponse<Game>>;
    public abstract getGameById(id: number, withPlayUrl?: boolean): Promise<Game[]>;
    public abstract getOwnedGames(): Promise<Game[]>;
    public abstract searchGames(query: string): Promise<Game[]>;
    public abstract getFiveRandomGames(): Promise<Game[]>;
    public abstract createGame(game: Game, thumbnail: Blob, images: Blob[]): Promise<Game>;
    public abstract updateGame(game: Game, thumbnail?: Blob, images?: Blob[]): Promise<Game>;
    public abstract deleteGame(id: number): Promise<void>;
}
