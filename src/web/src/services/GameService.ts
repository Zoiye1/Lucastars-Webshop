import { Game, GamesResponse, PaginatedResponse } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";

export class GameService implements IGameService {
    public async getGames(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: "name" | "price" | "created"
    ): Promise<PaginatedResponse<Game>> {
        let url: string = `${VITE_API_URL}games?page=${page}&limit=${limit}`;

        if (sort) {
            url += `&sort=${sort}`;
        }

        if (sortBy) {
            url += `&sortBy=${sortBy}`;
        }

        const response: Response = await fetch(url);

        const gamesResponse: PaginatedResponse<Game> = await response.json() as unknown as PaginatedResponse<Game>;

        return gamesResponse;
    }

    public async getOwnedGames(): Promise<Game[]> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}owned-games`, {
                credentials: "include",
            });

            const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

            return gamesResponse.games;
        }
        catch (error) {
            console.error("Error fetching owned games:", error);
            return [];
        }
    }
}
