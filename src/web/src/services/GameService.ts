import { Game, GamesResponse } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";

export class GameService implements IGameService {
    public async getGames(): Promise<Game[]> {
        const response: Response = await fetch(`${VITE_API_URL}games`);

        const gamesReponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesReponse.games;
    }

    public async getGameById(id: number): Promise<Game[]> {
        const url: string = `${VITE_API_URL}game-info?id=${encodeURIComponent(id)}`;
        const response: Response = await fetch(url);

        const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesResponse.games;
    }

    public async getFiveRandomGames(): Promise<Game[]> {
        const url: string = `${VITE_API_URL}five-random-games`;
        const response: Response = await fetch(url);

        const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesResponse.games;
    }

    public async getOwnedGames(id?: number): Promise<Game[]> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}owned-games?id=${id}`, {
                credentials: "include",
            });

            const gamesReponse: GamesResponse = await response.json() as unknown as GamesResponse;

            return gamesReponse.games;
        }
        catch (error) {
            console.error("Error fetching owned games:", error);
            return [];
        }
    }

    public async searchGames(query: string): Promise<Game[]> {
        const url: string = `${VITE_API_URL}games/search?q=${encodeURIComponent(query)}`;
        const response: Response = await fetch(url);

        const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesResponse.games;
    }
}
