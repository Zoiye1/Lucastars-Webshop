import { GameTagCount, OrdersByMonth, TurnoverByMonth } from "@shared/types";

export class ChartService {
    public async getTurnover(year?: number): Promise<TurnoverByMonth[]> {
        const res: Response = await fetch(`${VITE_API_URL}chart/turnover?year=${year || new Date().getFullYear()}`, {
            credentials: "include",
        });

        return await res.json() as unknown as TurnoverByMonth[];
    }

    public async getOrders(_month?: number, _year?: number): Promise<OrdersByMonth[]> {
        const res: Response = await fetch(`${VITE_API_URL}chart/orders`, {
            credentials: "include",
        });

        return await res.json() as unknown as OrdersByMonth[];
    }

    public async getGamesTags(): Promise<GameTagCount[]> {
        const res: Response = await fetch(`${VITE_API_URL}chart/tags`, {
            credentials: "include",
        });

        return await res.json() as unknown as GameTagCount[];
    }
}
