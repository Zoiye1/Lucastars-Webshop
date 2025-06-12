import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";

import { NotificationEvent, Tag } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { TagService } from "@web/services/TagService";
import { WebshopEvent } from "@web/enums/WebshopEvent";
import { WebshopEventService } from "@web/services/WebshopEventService";

/**
 * This page displays form for creating or editing a tag.
 */
export class TagFormPageComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();
    private _tagService: TagService = new TagService();

    private _tag?: Tag;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Get tag ID from URL parameters
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const tagId: number | null = urlParams.get("id") ? parseInt(urlParams.get("id")!) : null;

        if (tagId) {
            this._tagService.getTag(tagId).then(tag => {
                this._tag = tag;
                this.render();
            }).catch((error: unknown) => {
                console.error("Error fetching tag:", error);
                this.render();
            });
        }
        else {
            this.render();
        }
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                input {
                    border: 1px solid #d0d0d0;
                    padding: 8px 8px;
                }

                h2 {
                    text-align: center;
                    margin: 0;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                }

                .full-width {
                    grid-column: 1 / -1;
                }

                .two-column {
                    grid-column: span 2;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 15px;
                }

                label {
                    margin-bottom: 5px;
                }

                label span.required {
                    color: red;
                }

                .actions {
                    display: flex;
                    justify-content: space-between;
                }

                .actions button {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    background-color: var(--primary-color);
                    color: white;
                    cursor: pointer;
                }

                .actions button:hover {
                    background-color: var(--primary-color-dark);
                }

                .actions button[type="button"] {
                    background-color: #6c757d;
                }

                .actions button[type="button"]:hover {
                    background-color: #5a6268;
                }
            </style>
        `;

        const formElement: HTMLFormElement = html`
            <form class="grid">
                <div class="field full-width">
                    <label for="name">Naam <span class="required">*</span></label>
                    <input type="text" name="value" value="${this._tag ? this._tag.value : ""}" required />
                </div>

                <div class="actions full-width">
                    <button type="button" onclick="history.back()">Annuleren</button>
                    <button type="submit">Opslaan</button>
                </div>
            </form>
        ` as HTMLFormElement;

        formElement.addEventListener("submit", async (event: SubmitEvent) => {
            await this.handleFormSubmit(event);
        });

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(formElement);

        dashboard.pageTitle = `Tag ${this._tag ? "bewerken" : "toevoegen"}`;

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
            </webshop-layout>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }

    private async handleFormSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formData: FormData = new FormData(form);

        const tag: Tag = {
            id: this._tag ? this._tag.id : 0,
            value: formData.get("value") as string,
        };

        if (!this._tag) {
            await this._tagService.createTag(tag);
        }
        else {
            await this._tagService.updateTag(tag);
        }

        this._webshopEventService.dispatchEvent<NotificationEvent>(
            WebshopEvent.Notification,
            {
                type: "success",
                message: `Tag ${this._tag ? "bewerkt" : "toegevoegd"}! Je wordt nu teruggestuurd naar de game lijst.`,
            }
        );

        setTimeout(() => {
            window.location.href = "/dashboard/tags.html";
        }, 2000);
    }
}

window.customElements.define("webshop-page-dashboard-tags-form", TagFormPageComponent);
