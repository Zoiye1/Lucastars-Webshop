import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import "@web/components/UserInfoModalComponent";
import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { OrdersGamesService } from "@web/services/OrdersGamesService";
import { IUser, Order, PaginatedResponse } from "@shared/types";
import { UserInfoModalComponent } from "@web/components/UserInfoModalComponent";

import { Tabulator, AjaxModule, PageModule, SortModule, FormatModule, InteractionModule, TooltipModule, CellComponent } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";

type TabulatorParams = {
    page?: number;
    size?: number;
    sort?: { field: string; dir: "asc" | "desc" }[];
};

class DashboardOrdersPageComponent extends HTMLElement {
    private _ordersGamesService: OrdersGamesService = new OrdersGamesService();
    private _userInfoModal: UserInfoModalComponent = document.createElement("user-info-modal") as UserInfoModalComponent;

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

                const response: PaginatedResponse<Order> = await this._ordersGamesService.getOrders(
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
                { title: "Gebruiker", field: "user.email", formatter: this.userInfoFormatter },
                { title: "Datum", field: "orderDate", formatter: this.isoDateTimeFormatter, width: 200 },
                { title: "Aantal spellen", field: "items", formatter: this.arrayLengthFormatter, width: 150 },
                { title: "Status", field: "status", width: 100 },
                { title: "Totaal", field: "totalAmount", formatter: "money", formatterParams: { symbol: "€" }, width: 100 },
            ],
            initialSort: [{ column: "id", dir: "asc" }],
            popupContainer: tableContainer,
        });

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(tableContainer);

        dashboard.pageTitle = "Bestellingen";

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
                ${this._userInfoModal}
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

    private arrayLengthFormatter = (cell: CellComponent): string => {
        const value: unknown[] = cell.getValue() as unknown[];
        return value.length.toString();
    };

    private isoDateTimeFormatter = (cell: CellComponent): string => {
        const value: string = cell.getValue() as string;

        if (!value) {
            return "";
        }

        const date: Date = new Date(value);
        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("nl-NL");
    };

    private userInfoFormatter = (cell: CellComponent): HTMLElement => {
        const user: IUser = cell.getData().user as IUser;

        const button: HTMLButtonElement = document.createElement("button");
        button.className = "action-btn";
        button.textContent = user.email;
        button.addEventListener("click", (event: MouseEvent) => {
            event.stopPropagation();
            this._userInfoModal.showModal(user);
        });

        return button;
    };
}

window.customElements.define("webshop-page-dashboard-orders", DashboardOrdersPageComponent);
