import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import { html } from "@web/helpers/webComponents";
import { Chart, ChartConfiguration, ChartType, TooltipItem } from "chart.js/auto";
import { ChartService } from "@web/services/ChartService";
import { GameTagCount, OrdersByMonth, TurnoverByMonth } from "@shared/types";

class DashboardIndexPageComponent extends HTMLElement {
    private readonly _chartService: ChartService = new ChartService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .charts-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 20px;
                    margin-top: 20px;
                }
                
                .chart-card {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 15px;
                    border: 1px solid #ddd;
                }
                
                .chart-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .full-width {
                    grid-column: 1 / span 2;
                }
                
                canvas {
                    width: 100% !important;
                    height: 250px !important;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-dashboard>                    
                    <div class="charts-container">
                        <div class="chart-card">
                            <div class="chart-title">Maandelijkse omzet</div>
                            <canvas id="sales-chart"></canvas>
                        </div>
                        <div class="chart-card">
                            <div class="chart-title">Productcategorieën</div>
                            <canvas id="category-chart"></canvas>
                        </div>
                        <div class="chart-card full-width">
                            <div class="chart-title">Orders</div>
                            <canvas id="orders-chart"></canvas>
                        </div>
                    </div>
                </webshop-dashboard>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);

        void this.initializeCharts();
    }

    private async initializeCharts(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        await this.createSalesChart(this.shadowRoot.querySelector("#sales-chart")!);
        await this.createCategoryChart(this.shadowRoot.querySelector("#category-chart")!);
        await this.createOrdersChart(this.shadowRoot.querySelector("#orders-chart")!);
    }

    private async createSalesChart(canvas: HTMLCanvasElement): Promise<void> {
        const months: string[] = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
        const turnOver: TurnoverByMonth[] = await this._chartService.getTurnover();

        const chartOptions: ChartConfiguration = {
            type: "bar",
            data: {
                labels: turnOver.map(item => months[item.month - 1]),
                datasets: [{
                    label: "Bedrag",
                    data: turnOver.map(item => item.turnover),
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return new Intl.NumberFormat("nl-NL", {
                                    style: "currency",
                                    currency: "EUR",
                                    minimumFractionDigits: 2,
                                }).format(value as number);
                            },
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context: TooltipItem<ChartType>) {
                                const amount: string = new Intl.NumberFormat("nl-NL", {
                                    style: "currency",
                                    currency: "EUR",
                                    minimumFractionDigits: 2,
                                }).format(context.raw as number);

                                return `${context.dataset.label}: ${amount}`;
                            },
                        },
                    },
                },
            },
        };

        new Chart(canvas, chartOptions);
    }

    private async createCategoryChart(canvas: HTMLCanvasElement): Promise<void> {
        const gameTagAmounts: GameTagCount[] = await this._chartService.getGamesTags();

        const chartOptions: ChartConfiguration = {
            type: "pie",
            data: {
                labels: gameTagAmounts.map(item => item.tag),
                datasets: [{
                    data: gameTagAmounts.map(item => item.count),
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };

        new Chart(canvas, chartOptions);
    }

    private async createOrdersChart(canvas: HTMLCanvasElement): Promise<void> {
        const orders: OrdersByMonth[] = await this._chartService.getOrders();

        const chartOptions: ChartConfiguration = {
            type: "line",
            data: {
                labels: orders.map(item => item.date),
                datasets: [{
                    label: "Aantal orders",
                    data: orders.map(item => item.orderCount),
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    tension: 0.3,
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            callback: function (value) {
                                return Number(value).toFixed(0);
                            },
                        },
                    },
                },
            },
        };

        new Chart(canvas, chartOptions);
    }
}

window.customElements.define("webshop-page-dashboard-index", DashboardIndexPageComponent);
