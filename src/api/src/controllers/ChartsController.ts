import { ChartService } from "@api/services/ChartService";
import { GameTagCount, OrdersByMonth, TurnoverByMonth } from "@shared/types";
import { Request, Response } from "express";

export class ChartController {
    private readonly _checkoutService: ChartService = new ChartService();

    public async getTurnoverByYear(req: Request, res: Response): Promise<void> {
        const year: number = req.params.year ? parseInt(req.params.year) : new Date().getFullYear();

        const turnover: TurnoverByMonth[] = await this._checkoutService.getTurnoverByYear(year);

        res.status(200).json(turnover);
    }

    public async getOrdersByMonth(_req: Request, res: Response): Promise<void> {
        const orders: OrdersByMonth[] = await this._checkoutService.getOrdersByMonth();

        res.status(200).json(orders);
    }

    public async getGamesTags(_req: Request, res: Response): Promise<void> {
        const tags: GameTagCount[] = await this._checkoutService.getGamesTags();

        res.status(200).json(tags);
    }
}
