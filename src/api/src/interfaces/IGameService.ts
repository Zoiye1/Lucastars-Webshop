import { Game, PaginatedResponse } from "@shared/types";

@Interface
export abstract class IGameService {
    public abstract getGames(page: number, limit: number): Promise<PaginatedResponse<Game>>;
    public abstract getOwnedGames(userId: number): Promise<Game[]>;
}
