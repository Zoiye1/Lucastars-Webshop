import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import "@web/components/ConfirmModalComponent";

import { html } from "@web/helpers/webComponents";
import { GameService } from "@web/services/GameService";
import { Game, NotificationEvent, PaginatedResponse } from "@shared/types";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { ConfirmModalComponent } from "@web/components/ConfirmModalComponent";

import { Tabulator, AjaxModule, PageModule, SortModule, FormatModule, InteractionModule, TooltipModule } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WebshopEvent } from "@web/enums/WebshopEvent";

type TabulatorParams = {
    page?: number;
    size?: number;
    sort?: { field: string; dir: "asc" | "desc" }[];
};

class DashboardGamesPageComponent extends HTMLElement {
    private _gameService: GameService = new GameService();
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    private _confirmModal: ConfirmModalComponent = document.createElement("webshop-confirm-modal") as ConfirmModalComponent;

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
                    padding: 0;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--primary-color);
                }

                .action-buttons {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }

                .action-btn.icon {
                    display: flex;
                    height: 100%;
                    align-items: center;
                }

                .tabulator-cell:has(.action-btn.icon) {
                    padding: 0;
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
                {
                    title: "Acties",
                    width: 100,
                    headerSort: false,
                    formatter: cell => {
                        const game: Game = cell.getRow().getData() as Game;

                        const editLink: HTMLAnchorElement = document.createElement("a");
                        editLink.className = "action-btn icon";
                        editLink.href = `/dashboard/game-form.html?id=${game.id}`;

                        const editIcon: HTMLImageElement = document.createElement("img");
                        editIcon.src = "/images/icons/pencil.svg";
                        editIcon.alt = "Bewerken";
                        editLink.appendChild(editIcon);

                        const deleteButton: HTMLButtonElement = document.createElement("button");
                        deleteButton.className = "action-btn icon";

                        const deleteIcon: HTMLImageElement = document.createElement("img");
                        deleteIcon.src = "/images/icons/trash-red.svg";
                        deleteIcon.alt = "Verwijderen";
                        deleteButton.appendChild(deleteIcon);

                        deleteButton.addEventListener("click", () => {
                            const game: Game = cell.getRow().getData() as Game;

                            this._confirmModal.showModal(
                                "Bevestig verwijderen",
                                `Weet je zeker dat je het spel "${game.name}" wilt verwijderen?`
                            );

                            this._confirmModal.onConfirm = async () => {
                                await this._gameService.deleteGame(game.id);
                                await cell.getRow().delete();
                                this._webshopEventService.dispatchEvent<NotificationEvent>(
                                    WebshopEvent.Notification,
                                    {
                                        type: "success",
                                        message: `Game "${game.name}" succesvol verwijderd`,
                                    }
                                );
                            };
                        });

                        return html`
                            <div class="action-buttons">
                                ${editLink}
                                ${deleteButton}
                            </div>
                        `;
                    },
                },
            ],
            initialSort: [{ column: "id", dir: "asc" }],
            popupContainer: tableContainer,
        });

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(tableContainer);

        dashboard.pageTitle = "Games";
        dashboard.pageButton = {
            title: "Voeg game toe",
            icon: "/images/icons/add-circle.svg",
            action: () => {
                location.href = "/dashboard/game-form.html";
            },
        };

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
                ${this._confirmModal}
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-dashboard-games", DashboardGamesPageComponent);
