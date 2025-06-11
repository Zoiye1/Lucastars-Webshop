import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import "@web/components/UserInfoModalComponent";

import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { IUser, PaginatedResponse } from "@shared/types";
import { UserService } from "@web/services/UserService";
import { UserInfoModalComponent } from "@web/components/UserInfoModalComponent";

import { Tabulator, AjaxModule, PageModule, SortModule, FormatModule, InteractionModule, TooltipModule, CellComponent } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";

type TabulatorParams = {
    page?: number;
    size?: number;
    sort?: { field: string; dir: "asc" | "desc" }[];
};

class DashboardUsersPageComponent extends HTMLElement {
    private _userService: UserService = new UserService();

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
                    padding: 0;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--primary-color);
                }

                .action-btn.delete {
                    color: red;
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

                const response: PaginatedResponse<IUser> = await this._userService.getUsers(
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
                { title: "Gebruikersnaam", field: "username" },
                { title: "E-mail", field: "email" },
                { title: "Rol", field: "role", width: 100 },
                { title: "Geregistreerd op", field: "created", formatter: this.isoDateTimeFormatter, width: 175 },
                {
                    title: "Acties",
                    width: 100,
                    headerSort: false,
                    formatter: cell => {
                        const button: HTMLButtonElement = document.createElement("button");
                        button.className = "action-btn icon";

                        const icon: HTMLImageElement = document.createElement("img");
                        icon.src = "/images/icons/eye-outline.svg";
                        icon.alt = "Details";
                        button.appendChild(icon);

                        button.addEventListener("click", (event: MouseEvent) => {
                            event.stopPropagation();
                            const user: IUser = cell.getData() as IUser;
                            this._userInfoModal.showModal(user);
                        });
                        return button;
                    },
                },
            ],
            initialSort: [{ column: "id", dir: "asc" }],
            popupContainer: tableContainer,
        });

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(tableContainer);

        dashboard.pageTitle = "Gebruikers";

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
                ${this._userInfoModal}
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

    private nameFormatter = (cell: CellComponent): string => {
        const user: IUser = cell.getData() as IUser;

        const parts: string[] = [user.firstName, user.prefix, user.lastName].filter(part => part !== null);
        return parts.join(" ").trim();
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

        return date.toLocaleDateString("nl-NL");
    };
}

window.customElements.define("webshop-page-dashboard-users", DashboardUsersPageComponent);
