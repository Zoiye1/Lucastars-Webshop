import { html } from "@web/helpers/webComponents";

export class SortingControlsComponent extends HTMLElement {
    private _sortBy: string = "name";
    private _sortOrder: "asc" | "desc" = "asc";
    private _sortChangeCallback: ((sortBy: string, sortOrder: "asc" | "desc") => void) | null = null;

    private _totalResultsSpan: HTMLSpanElement | null = null;

    public set totalResults(value: number) {
        if (this._totalResultsSpan) {
            this._totalResultsSpan.textContent = `${value} resultaten`;
        }
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

        const sortSelect: HTMLSelectElement = html`
            <select id="sort-select">
                <option value="name">Naam</option>
                <option value="price">Prijs</option>
                <option value="created">Datum toegevoegd</option>
            </select>
        ` as HTMLSelectElement;

        Array.from(sortSelect.options).forEach(option => {
            if (option.value === this._sortBy) {
                option.selected = true;
            }
        });

        const sortDirection: HTMLButtonElement = html`
            <button class="sort-direction" id="sort-direction">
                ${this._sortOrder === "asc" ? "↑" : "↓"}
            </button>
        ` as HTMLButtonElement;

        this._totalResultsSpan = html`
            <span>0 resultaten</span>
        ` as HTMLSpanElement;

        const element: HTMLElement = html`
            <div class="controls-container">
                <div class="sort-controls">
                    <label for="sort-select">Sorteer op:</label>
                    ${sortSelect}
                    ${sortDirection}
                </div>
                <div class="total-results">
                    ${this._totalResultsSpan}
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Add event listeners
        sortSelect.addEventListener("change", () => {
            this._sortBy = sortSelect.value;
            if (this._sortChangeCallback) {
                this._sortChangeCallback(this._sortBy, this._sortOrder);
            }
        });

        sortDirection.addEventListener("click", () => {
            console.log("Sort direction clicked");
            this._sortOrder = this._sortOrder === "asc" ? "desc" : "asc";
            sortDirection.textContent = this._sortOrder === "asc" ? "↑" : "↓";
            if (this._sortChangeCallback) {
                this._sortChangeCallback(this._sortBy, this._sortOrder);
            }
        });
    }
}

window.customElements.define("webshop-sorting-controls", SortingControlsComponent);
