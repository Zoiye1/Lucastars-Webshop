import { Game } from "@shared/types";

@Interface
export abstract class IGameService {
    public abstract getGames(): Promise<Game[]>;
    public abstract getGameByName(name: string): Promise<Game[]>;
}
