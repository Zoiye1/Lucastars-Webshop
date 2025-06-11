import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";

@Interface
export abstract class IGameService {
    public abstract getGames(options: GetGamesOptions): Promise<PaginatedResponse<Game>>;
    public abstract getGameById(id: number, withPlayUrl?: boolean): Promise<Game[]>;
    public abstract getOwnedGames(userId: number, gameId?: number): Promise<Game[]>;
    public abstract searchGames(query: string): Promise<Game[]>;
    public abstract getFiveRandomGames(): Promise<Game[]>;
    public abstract updateGame(game: Game): Promise<Game>;
}
