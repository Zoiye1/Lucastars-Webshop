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

    public async getOrdersByMonth(req: Request, res: Response): Promise<void> {
        const month: number = req.params.month ? parseInt(req.params.month) : new Date().getMonth() + 1;
        const year: number = req.params.year ? parseInt(req.params.year) : new Date().getFullYear();

        const orders: OrdersByMonth[] = await this._checkoutService.getOrdersByMonth(month, year);

        res.status(200).json(orders);
    }

    public async getGamesTags(_req: Request, res: Response): Promise<void> {
        const tags: GameTagCount[] = await this._checkoutService.getGamesTags();

        res.status(200).json(tags);
    }
}
