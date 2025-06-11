import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import "@web/components/ConfirmModalComponent";

import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { TagService } from "@web/services/TagService";
import { Tag } from "@shared/types";
import { ConfirmModalComponent } from "@web/components/ConfirmModalComponent";

import { Tabulator, PageModule, SortModule, FormatModule, InteractionModule, AjaxModule } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";

class DashboardTagsPageComponent extends HTMLElement {
    private _tagService: TagService = new TagService();

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

        Tabulator.registerModule([AjaxModule, PageModule, SortModule, FormatModule, InteractionModule]);

        const tableContainer: HTMLElement = html`<div></div>`;

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(tableContainer);

        dashboard.pageTitle = "Tags";

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
                ${this._confirmModal}
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);

        // Wait for the DOM to be fully rendered before initializing Tabulator
        requestAnimationFrame(() => {
            new Tabulator(tableContainer, {
                layout: "fitColumns",
                ajaxURL: " ",
                ajaxRequestFunc: async (_url, _config, _params) => {
                    return await this._tagService.getTags();
                },
                pagination: true,
                paginationMode: "local",
                paginationSize: 10,
                paginationSizeSelector: true,
                paginationCounter: "rows",
                sortMode: "local",
                columns: [
                    { title: "ID", field: "id", width: 75 },
                    { title: "Naam", field: "value" },
                    {
                        title: "Acties",
                        width: 100,
                        headerSort: false,
                        formatter: cell => {
                            const button: HTMLButtonElement = document.createElement("button");
                            button.className = "action-btn icon";

                            const icon: HTMLImageElement = document.createElement("img");
                            icon.src = "/images/icons/trash-red.svg";
                            icon.alt = "Verwijderen";
                            button.appendChild(icon);

                            button.addEventListener("click", () => {
                                const tag: Tag = cell.getRow().getData() as Tag;

                                this._confirmModal.showModal(
                                    "Bevestig verwijderen",
                                `Weet je zeker dat je de tag "${tag.value}" wilt verwijderen?`
                                );

                                this._confirmModal.onConfirm = () => {
                                    console.log("Tag verwijderen:", tag.id);
                                };
                            });
                            return button;
                        },
                    },
                ],
                initialSort: [{ column: "id", dir: "asc" }],
                popupContainer: tableContainer,
            });
        });
    }
}

window.customElements.define("webshop-page-dashboard-tags", DashboardTagsPageComponent);
