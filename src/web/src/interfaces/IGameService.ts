import { Game, PaginatedResponse } from "@shared/types";

export abstract class IGameService {
    public abstract getGames(page?: number, limit?: number): Promise<PaginatedResponse<Game>>;
    public abstract getOwnedGames(): Promise<Game[]>;
}
