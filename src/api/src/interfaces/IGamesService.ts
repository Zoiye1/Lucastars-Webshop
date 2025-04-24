import { Game } from "@shared/types";

@Interface
export abstract class IGamesService {
    public abstract getGames(): Promise<Game[]>;
}
