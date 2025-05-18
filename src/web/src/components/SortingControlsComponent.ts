import { html } from "@web/helpers/webComponents";

export class SortingControlsComponent extends HTMLElement {
    private _totalResults: number = 0;
    private _sortBy: string = "name";
    private _sortOrder: "asc" | "desc" = "asc";
    private _sortChangeCallback: ((sortBy: string, sortOrder: "asc" | "desc") => void) | null = null;

    public set totalResults(value: number) {
        this._totalResults = value;
        this.render();
    }

    public set onSortChange(callback: (sortBy: string, sortOrder: "asc" | "desc") => void) {
        this._sortChangeCallback = callback;
    }

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
                .controls-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .sort-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .sort-controls label {
                    font-weight: bold;
                }
                
                .sort-controls select {
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                
                .sort-direction {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .total-results {
                    font-weight: bold;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="controls-container">
                <div class="sort-controls">
                    <label for="sort-select">Sorteer op:</label>
                    <select id="sort-select">
                        <option value="name" .selected=${this._sortBy === "name"}>Naam</option>
                        <option value="price" .selected=${this._sortBy === "price"}>Prijs</option>
                        <option value="created" .selected=${this._sortBy === "created"}>Datum toegevoegd</option>
                    </select>
                    <button class="sort-direction" id="sort-direction">
                        ${this._sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                </div>
                <div class="total-results">
                    ${this._totalResults} resultaten
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Add event listeners
        const sortSelect: HTMLSelectElement | null = this.shadowRoot.querySelector("#sort-select");
        const sortDirection: HTMLElement | null = this.shadowRoot.querySelector("#sort-direction");

        if (sortSelect && sortDirection) {
            sortSelect.addEventListener("change", () => {
                this._sortBy = sortSelect.value;
                if (this._sortChangeCallback) {
                    this._sortChangeCallback(this._sortBy, this._sortOrder);
                }
            });

            sortDirection.addEventListener("click", () => {
                this._sortOrder = this._sortOrder === "asc" ? "desc" : "asc";
                sortDirection.textContent = this._sortOrder === "asc" ? "↑" : "↓";
                if (this._sortChangeCallback) {
                    this._sortChangeCallback(this._sortBy, this._sortOrder);
                }
            });
        }
    }
}

window.customElements.define("webshop-sorting-controls", SortingControlsComponent);
