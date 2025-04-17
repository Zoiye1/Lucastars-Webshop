export type GamesApiResponse = {
    SKU: string;
    Title: string;
    Thumbnail: string;
    Images: string[] | null;
    DescriptionHtml: string;
    Url: string;
    Authors: string[];
    Tags: string[];
    Reviews: string[] | null;
};

let games: GamesApiResponse[] | null = null;

export class ExternalGamesService {
    public async getGames(): Promise<GamesApiResponse[]> {
        if (!games) {
            games = await this.fetchGames();
        }

        return games;
    }

    private async fetchGames(): Promise<GamesApiResponse[]> {
        const response: Response = await fetch("https://lucastars.hbo-ict.cloud/api/games/json");
        const data: GamesApiResponse[] = await response.json() as GamesApiResponse[];

        return data;
    }
}
