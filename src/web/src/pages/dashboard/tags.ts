import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { TagService } from "@web/services/TagService";
import { Tag } from "@shared/types";

import { Tabulator, PageModule, SortModule, FormatModule, InteractionModule } from "tabulator-tables";
import tabulatorCSS from "tabulator-tables/dist/css/tabulator_semanticui.min.css?raw";

class DashboardTagsPageComponent extends HTMLElement {
    private _tagService: TagService = new TagService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const tags: Tag[] = await this._tagService.getTags();

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

        Tabulator.registerModule([PageModule, SortModule, FormatModule, InteractionModule]);

        const tableContainer: HTMLElement = html`<div></div>`;

        new Tabulator(tableContainer, {
            layout: "fitColumns",
            data: tags,
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

                        button.addEventListener("click", (event: MouseEvent) => {
                            event.stopPropagation();
                            if (confirm("Weet je zeker dat je deze tag wilt verwijderen?")) {
                                console.log("Tag verwijderen:", cell.getData().id);
                            }
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

        dashboard.pageTitle = "Tags";

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-dashboard-tags", DashboardTagsPageComponent);
