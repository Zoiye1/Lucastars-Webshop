import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import "@web/components/ConfirmModalComponent";

import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { TagService } from "@web/services/TagService";
import { NotificationEvent, Tag } from "@shared/types";
import { ConfirmModalComponent } from "@web/components/ConfirmModalComponent";
import { WebshopEvent } from "@web/enums/WebshopEvent";
import { WebshopEventService } from "@web/services/WebshopEventService";

import { Tabulator, PageModule, SortModule, FormatModule, InteractionModule, AjaxModule } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";

class DashboardTagsPageComponent extends HTMLElement {
    private _tagService: TagService = new TagService();
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

        Tabulator.registerModule([AjaxModule, PageModule, SortModule, FormatModule, InteractionModule]);

        const tableContainer: HTMLElement = html`<div></div>`;

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(tableContainer);

        dashboard.pageTitle = "Tags";
        dashboard.pageButton = {
            title: "Voeg tag toe",
            icon: "/images/icons/add-circle.svg",
            action: () => {
                location.href = "/dashboard/tag-form";
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

        // Hack: Wait for the DOM to be fully rendered before initializing Tabulator
        setTimeout(async () => {
            const table: Tabulator = new Tabulator(tableContainer, {
                layout: "fitColumns",
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
                            const tag: Tag = cell.getRow().getData() as Tag;

                            const editLink: HTMLAnchorElement = document.createElement("a");
                            editLink.className = "action-btn icon";
                            editLink.href = `/dashboard/tag-form?id=${tag.id}`;

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
                                this._confirmModal.showModal(
                                    "Bevestig verwijderen",
                                    `Weet je zeker dat je de tag "${tag.value}" wilt verwijderen?`
                                );

                                this._confirmModal.onConfirm = async () => {
                                    await this._tagService.deleteTag(tag.id);
                                    await cell.getRow().delete();
                                    this._webshopEventService.dispatchEvent<NotificationEvent>(
                                        WebshopEvent.Notification,
                                        {
                                            type: "success",
                                            message: `Tag "${tag.value}" succesvol verwijderd`,
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

            const tags: Tag[] = await this._tagService.getTags();

            await table.replaceData(tags);
        }, 100);
    }
}

window.customElements.define("webshop-page-dashboard-tags", DashboardTagsPageComponent);
