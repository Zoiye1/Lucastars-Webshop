import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import { html } from "@web/helpers/webComponents";
import { GameService } from "@web/services/GameService";
import { Game, PaginatedResponse } from "@shared/types";
import { DashboardComponent } from "@web/components/DashboardComponent";

import { Tabulator, AjaxModule, PageModule, SortModule, FormatModule, InteractionModule, TooltipModule } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";

type TabulatorParams = {
    page?: number;
    size?: number;
    sort?: { field: string; dir: "asc" | "desc" }[];
};

class DashboardGamesPageComponent extends HTMLElement {
    private _gameService: GameService = new GameService();

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
                ${tabulatorCSS}

                .tabulator {
                    margin: 0;
                }

                .action-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--primary-color);
                }

                .action-btn.delete {
                    color: red;
                }
            </style>
        `;

        Tabulator.registerModule([AjaxModule, PageModule, SortModule, FormatModule, InteractionModule, TooltipModule]);

        const tableContainer: HTMLElement = html`<div></div>`;

        new Tabulator(tableContainer, {
            layout: "fitColumns",
            ajaxURL: " ",
            ajaxRequestFunc: async (_url, _config, params: TabulatorParams) => {
                const page: number = params.page || 1;
                const limit: number = params.size || 10;

                let sort: "asc" | "desc" | undefined;
                let sortBy: string | undefined;

                if (params.sort && params.sort.length > 0) {
                    sortBy = params.sort[0].field;
                    sort = params.sort[0].dir;
                }

                const response: PaginatedResponse<Game> = await this._gameService.getGames(
                    page,
                    limit,
                    sort,
                    sortBy
                );

                return {
                    data: response.items,
                    last_page: response.pagination.totalPages,
                };
            },
            pagination: true,
            paginationMode: "remote",
            paginationSize: 10,
            paginationSizeSelector: true,
            paginationCounter: "rows",
            sortMode: "remote",
            columns: [
                { title: "ID", field: "id", width: 75 },
                { title: "Naam", field: "name" },
                { title: "SKU", field: "sku", width: 200 },
                { title: "Tags", field: "tags", tooltip: true, formatterParams: { separator: "," }, width: 150 },
                { title: "Prijs", field: "price", formatter: "money", formatterParams: { symbol: "€", precision: 2 }, width: 100 },
            ],
            initialSort: [{ column: "id", dir: "asc" }],
            popupContainer: tableContainer,
        });

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(tableContainer);

        dashboard.pageTitle = "Games";

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-dashboard-games", DashboardGamesPageComponent);
