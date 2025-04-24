import { Game, GamesResponse } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";

export class GameService implements IGameService {
    public async getGames(): Promise<Game[]> {
        const response: Response = await fetch(`${VITE_API_URL}games`);

        const gamesReponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesReponse.games;
    }
}
