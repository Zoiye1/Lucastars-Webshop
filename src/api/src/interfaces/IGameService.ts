import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";

@Interface
export abstract class IGameService {
    public abstract getGames(options: GetGamesOptions): Promise<PaginatedResponse<Game>>;
    public abstract getOwnedGames(userId: number): Promise<Game[]>;
}
