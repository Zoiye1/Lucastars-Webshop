import { Game } from "@shared/types";

export abstract class IGameService {
    public abstract getGames(): Promise<Game[]>;
    public abstract getGameById(id: number): Promise<Game[]>;
    public abstract getOwnedGames(): Promise<Game[]>;
    public abstract searchGames(query: string): Promise<Game[]>;
    public abstract getFiveRandomGames(): Promise<Game[]>;
}
