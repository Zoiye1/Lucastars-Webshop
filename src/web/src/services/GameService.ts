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
}
