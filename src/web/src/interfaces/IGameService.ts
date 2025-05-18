import { Game, PaginatedResponse } from "@shared/types";

export abstract class IGameService {
    public abstract getGames(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: "name" | "price" | "created"
    ): Promise<PaginatedResponse<Game>>;
    public abstract getOwnedGames(): Promise<Game[]>;
}
