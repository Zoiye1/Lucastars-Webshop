import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";

import { Game, NotificationEvent, Tag } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { DashboardComponent } from "@web/components/DashboardComponent";
import { GameService } from "@web/services/GameService";
import { TagService } from "@web/services/TagService";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WebshopEvent } from "@web/enums/WebshopEvent";

import * as FilePond from "filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import filepondCoreCSS from "filepond/dist/filepond.min.css?raw";
import filepondPreviewCSS from "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css?raw";

import Quill, { Delta, Op } from "quill";
import quillThemeCSS from "quill/dist/quill.snow.css?raw";
import quillCoreCSS from "quill/dist/quill.core.css?raw";

import TomSelect from "tom-select";
import tomSelectCSS from "tom-select/dist/css/tom-select.css?raw";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

/**
 * This page displays form for creating or editing a game.
 */
export class GameFormPageComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    private _gameService: GameService = new GameService();
    private _tagService: TagService = new TagService();

    private _game?: Game;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Get game ID from URL parameters
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const gameId: number | null = urlParams.get("id") ? parseInt(urlParams.get("id")!) : null;

        if (gameId) {
            this._gameService.getGameById(gameId, true).then(games => {
                this._game = games[0];
                void this.render();
            }).catch((error: unknown) => {
                console.error("Error fetching game:", error);
                void this.render();
            });
        }
        else {
            void this.render();
        }
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                ${filepondCoreCSS}
                ${filepondPreviewCSS}
                ${quillThemeCSS}
                ${quillCoreCSS}
                ${tomSelectCSS}

                /* Toolbar Styles */
.ql-editor.ql-blank::before {
    color: #a0aec0;
    font-style: normal;
}

.ql-editor h1,
.ql-editor h2,
.ql-editor h3 {
    font-size: 1.75rem !important;
    font-weight: 700;
    color: #2d3748;
    border-bottom: 0;
    margin-bottom: 0.75em;
    line-height: 1.2;
}
.ql-editor p,
.ql-editor ul,
.ql-editor ol,
.ql-snow .ql-editor pre {
    margin-bottom: 1em;
}
.ql-editor strong {
    font-weight: 700;
}
.ql-editor ol, 
.ql-editor ul {
    padding-left: 0;
}
.ql-editor li {
    margin-bottom: 0.25em;
}
.ql-editor a {
    color: #4299e1;
}
.ql-editor blockquote {
    position: relative;
    display: block;
    margin-top: 1.875em !important;
    margin-bottom: 1.875em !important;
    font-size: 1.875rem;
    line-height: 1.2;
    border-left: 3px solid #cbd5e0;
    font-weight: 600;
    color: #4a5568;
    font-style: normal;
    letter-spacing: -0.05em;
}
.ql-snow .ql-editor pre {
    display: block;
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 1rem;
}
.ql-snow .ql-editor img {
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}
.ql-editor iframe {
    width: 100%;
    max-width: 100%;
    height: 400px;
}
                .ql-editor {
                    background-color: white;
                    resize: vertical;
                    min-height: 200px;
                }

                .ql-editor h1,
                .ql-editor h2 {
                  margin: 1em 0;
                  text-align: left;
                }

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

        const tags: Tag[] = await this._tagService.getTags();

        const tagOptions: HTMLOptionElement[] = tags.map(tag => {
            const option: HTMLOptionElement = html`
                <option value="${tag.id}">
                    ${tag.value}
                </option>
            ` as HTMLOptionElement;

            option.selected = this._game ? this._game.tags.includes(tag.value) : false;

            return option;
        });

        const formElement: HTMLFormElement = html`
            <form class="grid">
                <div class="field">
                    <label for="name">Naam <span class="required">*</span></label>
                    <input type="text" name="name" value="${this._game ? this._game.name : ""}" required />
                </div>

                <div class="field">
                    <label for="sku">SKU <span class="required">*</span></label>
                    <input type="text" name="sku" value="${this._game ? this._game.sku : ""}" required />
                </div>

                <div class="field">
                    <label for="price">Prijs (in euros) <span class="required">*</span></label>
                    <input type="number" name="price" value="${this._game ? this._game.price : ""}" min="1" step="0.01" required />
                </div>

                <div class="field">
                    <label for="playUrl">Speel url <span class="required">*</span></label>
                    <input type="text" name="playUrl" value="${this._game ? this._game.url! : ""}" required />
                </div>

                <div class="field full-width">
                    <label for="tags">Tags</label>
                    <select name="tags" autocomplete="off" multiple>
                        ${tagOptions}
                    </select>
                </div>

                <div class="field full-width">
                    <label for="description">Beschrijving <span class="required">*</span></label>
                    <div id="description-editor"></div>
                </div>

                <div class="field two-column">
                    <label for="image">Thumbnail <span class="required">*</span></label>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        data-max-file-size="3MB"
                        required
                    />
                </div>

                <div class="field two-column">
                    <label for="image">Afbeeldingen</label>
                    <input 
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        data-allow-reorder="true"
                        data-max-file-size="3MB"
                        data-max-files="8"
                    />
                </div>

                <div class="actions full-width">
                    <button type="button" onclick="history.back()">Annuleren</button>
                    <button type="submit">Opslaan</button>
                </div>
            </form>
        ` as HTMLFormElement;

        this.setupForm(formElement);

        const dashboard: DashboardComponent = document.createElement("webshop-dashboard") as DashboardComponent;
        dashboard.append(formElement);

        dashboard.pageTitle = `Game ${this._game ? "bewerken" : "toevoegen"}`;

        const element: HTMLElement = html`
            <webshop-layout>
                ${dashboard}
            </webshop-layout>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }

    private setupForm(form: HTMLFormElement): void {
        const tomSelect: TomSelect = new TomSelect(
            form.querySelector("select[name='tags']") as HTMLSelectElement,
            {
                plugins: ["remove_button"],
                valueField: "id",
                labelField: "value",
                searchField: ["value"],
            }
        );

        const quillEditor: Quill = new Quill(
            form.querySelector("#description-editor") as HTMLDivElement,
            {
                theme: "snow",
                modules: {
                    clipboard: {
                        matchers: [
                            ["*", (_node: Node, delta: Delta) => {
                                // Remove attributes from all ops in the delta
                                delta.ops.forEach((op: Op) => {
                                    if (op.attributes) {
                                        delete op.attributes;
                                    }
                                });

                                return delta;
                            }],
                        ],
                    },
                },
            }
        );

        quillEditor.clipboard.dangerouslyPasteHTML(
            this._game ? this._game.description : "",
            "api"
        );

        FilePond.registerPlugin(
            FilePondPluginImagePreview,
            FilePondPluginFileValidateSize,
            FilePondPluginFileValidateType
        );

        const thumbnailFile: FilePond.FilePond = FilePond.create(
            form.querySelector("input[type='file'][name='thumbnail']") as HTMLInputElement,
            {
                allowFileTypeValidation: true,
                acceptedFileTypes: ["image/png", "image/jpeg"],
                files: this._game ? [{ source: `${VITE_API_URL}uploads/${this._game.thumbnail}`, options: { type: "local" } }] : [],
                server: {
                    load: (source: string, load, error) => {
                        fetch(source, {
                            credentials: "include",
                        })
                            .then(response => response.blob())
                            .then(load)
                            .catch((err: unknown) => {
                                console.error("Error loading image:", err);
                                error("Could not load image");
                            });
                    },
                },
                credits: false,
            }
        );

        const imageFiles: FilePond.FilePond = FilePond.create(
            form.querySelector("input[type='file'][name='images']") as HTMLInputElement,
            {
                allowFileTypeValidation: true,
                acceptedFileTypes: ["image/png", "image/jpeg"],
                files: this._game ? this._game.images.map(image => ({ source: `${VITE_API_URL}uploads/${image}`, options: { type: "local" } })) : [],
                server: {
                    load: (source: string, load, error) => {
                        fetch(source, {
                            credentials: "include",
                        })
                            .then(response => response.blob())
                            .then(load)
                            .catch((err: unknown) => {
                                console.error("Error loading image:", err);
                                error("Could not load image");
                            });
                    },
                },
                credits: false,
            }
        );

        form.addEventListener("submit", async (event: SubmitEvent) => {
            await this.handleFormSubmit(event, tomSelect, quillEditor, thumbnailFile.getFile(), imageFiles.getFiles());
        });
    }

    private async handleFormSubmit(
        event: SubmitEvent,
        tomSelect: TomSelect,
        quillEditor: Quill,
        thumbnailFile: FilePond.FilePondFile,
        imageFiles: FilePond.FilePondFile[]
    ): Promise<void> {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formData: FormData = new FormData(form);

        const gameDescription: string = new QuillDeltaToHtmlConverter(quillEditor.getContents().ops, {
            inlineStyles: false,
        }).convert();

        const game: Game = {
            id: this._game ? this._game.id : 0,
            name: formData.get("name") as string,
            sku: formData.get("sku") as string,
            price: parseFloat(formData.get("price") as string),
            url: formData.get("playUrl") as string,
            description: gameDescription,
            tags: (tomSelect.getValue() as string[]).map(tag => tag.trim()),
            thumbnail: "",
            images: [],
        };

        if (!this._game) {
            await this._gameService.createGame(game, thumbnailFile.file, imageFiles.map(file => file.file));
        }
        else {
            await this._gameService.updateGame(game, thumbnailFile.file, imageFiles.map(file => file.file));
        }

        this._webshopEventService.dispatchEvent<NotificationEvent>(
            WebshopEvent.Notification,
            {
                type: "success",
                message: `Game ${this._game ? "bewerkt" : "toegevoegd"}! Je wordt nu teruggestuurd naar de game lijst.`,
            }
        );

        setTimeout(() => {
            window.location.href = "/dashboard/games";
        }, 2000);
    }
}

window.customElements.define("webshop-page-dashboard-games-form", GameFormPageComponent);
