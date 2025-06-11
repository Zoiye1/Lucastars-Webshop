import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import "@web/components/UserInfoModalComponent";
import "@web/components/ConfirmModalComponent";

import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { IUser, NotificationEvent, PaginatedResponse } from "@shared/types";
import { UserService } from "@web/services/UserService";
import { UserInfoModalComponent } from "@web/components/UserInfoModalComponent";
import { ConfirmModalComponent } from "@web/components/ConfirmModalComponent";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WebshopEvent } from "@web/enums/WebshopEvent";

import { Tabulator, AjaxModule, PageModule, SortModule, FormatModule, InteractionModule, TooltipModule, CellComponent } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";
import { authService } from "@web/services/AuthService";

type TabulatorParams = {
    page?: number;
    size?: number;
    sort?: { field: string; dir: "asc" | "desc" }[];
};

class DashboardUsersPageComponent extends HTMLElement {
    private _userService: UserService = new UserService();
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    private _userInfoModal: UserInfoModalComponent = document.createElement("user-info-modal") as UserInfoModalComponent;
    private _confirmModal: ConfirmModalComponent = document.createElement("webshop-confirm-modal") as ConfirmModalComponent;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
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

        const currentUser: IUser | undefined = await authService.getUser();

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
                        const user: IUser = cell.getRow().getData() as IUser;

                        const viewButton: HTMLButtonElement = document.createElement("button");
                        viewButton.className = "action-btn icon";

                        const viewIcon: HTMLImageElement = document.createElement("img");
                        viewIcon.src = "/images/icons/eye-outline.svg";
                        viewIcon.alt = "Details";
                        viewButton.appendChild(viewIcon);

                        viewButton.addEventListener("click", () => {
                            this._userInfoModal.showModal(user);
                        });

                        const roleButton: HTMLButtonElement = document.createElement("button");
                        roleButton.className = "action-btn icon";

                        const roleIcon: HTMLImageElement = document.createElement("img");
                        roleIcon.src = "/images/icons/admin-shield.svg";
                        roleIcon.alt = "Verwijderen";
                        roleButton.appendChild(roleIcon);

                        roleButton.addEventListener("click", () => {
                            this._confirmModal.showModal(
                                "Bevestig rol verandering",
                                `Weet je zeker dat je ${user.username} een ${user.role === "admin" ? "gebruiker" : "administrator"} wilt maken?`
                            );

                            this._confirmModal.onConfirm = async () => {
                                const newRole: string = await this._userService.toggleAdminRole(user.id);

                                await cell.getRow().update({
                                    role: newRole,
                                });

                                this._webshopEventService.dispatchEvent<NotificationEvent>(
                                    WebshopEvent.Notification,
                                    {
                                        type: "success",
                                        message: `${user.username} is nu een ${newRole === "admin" ? "administrator" : "gebruiker"}`,
                                    }
                                );
                            };
                        });

                        return html`
                            <div class="action-buttons">
                                ${viewButton}
                                ${currentUser?.id !== user.id ? roleButton : ""}
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

        dashboard.pageTitle = "Gebruikers";

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
                ${this._userInfoModal}
                ${this._confirmModal}
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

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
