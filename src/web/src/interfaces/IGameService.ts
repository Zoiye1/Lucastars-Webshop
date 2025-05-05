import { Game } from "@shared/types";

export abstract class IGameService {
    public abstract getGames(): Promise<Game[]>;
}
