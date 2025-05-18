import "@web/components/GameSelectComponent";
import "@web/components/SortingControlsComponent";
import "@web/components/FilterControlsComponent";
import { Game, PaginatedResponse } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { GameService } from "@web/services/GameService";
import { SortingControlsComponent } from "@web/components/SortingControlsComponent";
import { FilterControlsComponent } from "@web/components/FilterControlsComponent";

class GameListComponent extends HTMLElement {
    private _gameService: GameService = new GameService();
    private _currentPage: number = 1;
    private _totalPages: number = 1;
    private _itemsPerPage: number = 12;
    private _sortBy: string = "name";
    private _sortOrder: "asc" | "desc" = "asc";
    private _totalItems: number = 0;
    private _minPrice: number = 0;
    private _maxPrice: number = 100;
    private _selectedTags: number[] = [];

    private _sortingControls: SortingControlsComponent | null = null;
    private _filterControls: FilterControlsComponent | null = null;
    private _gamesContainer: HTMLElement | null = null;
    private _paginationContainer: HTMLElement | null = null;

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
                .games-page-container {
                    display: flex;
                    gap: 50px;
                }
                
                .filter-sidebar {
                    width: 250px;
                    flex-shrink: 0;
                }
                
                .games-content {
                    flex-grow: 1;
                }
                
                .games {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    margin: 20px;
                    gap: 10px;
                }
                
                .pagination button {
                    padding: 8px 16px;
                    background-color: white;
                    border: 1px solid #ddd;
                    cursor: pointer;
                    border-radius: 4px;
                    user-select: none;
                }

                .pagination button.icon {
                    display: flex;
                    padding: 0 8px 0 8px;
                    justify-content: center;
                    align-items: center;
                }
                
                .pagination button:disabled {
                    background-color: #ddd;
                    cursor: not-allowed;
                }

                .pagination button:hover:not(:disabled):not(.active) {
                    background-color: #f0f0f0;
                    border-color: #bbb;
                }
                
                .pagination button.active {
                    background-color: #159eff;
                    border-color: #159eff;
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .games-page-container {
                        flex-direction: column;
                    }
                    
                    .filter-sidebar {
                        width: 100%;
                    }
                }
            </style>
        `;

        this._filterControls = html`
            <webshop-filter-controls></webshop-filter-controls>
        ` as FilterControlsComponent;

        this._sortingControls = html`
            <webshop-sorting-controls total-results="${this._totalItems}"></webshop-sorting-controls>
        ` as SortingControlsComponent;

        this._gamesContainer = html`
            <div class="games"></div>
        `;

        this._paginationContainer = html`
            <div class="pagination"></div>
        `;

        const element: HTMLElement = html`
            <div class="games-page-container">
                <div class="filter-sidebar">
                    ${this._filterControls}
                </div>
                <div class="games-content">
                    ${this._sortingControls}
                    ${this._gamesContainer}
                    <div class="pagination-container">
                        ${this._paginationContainer}
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        await this.updateGames();

        this._sortingControls.onSortChange = async (sortBy: string, sortOrder: "asc" | "desc") => {
            this._sortBy = sortBy;
            this._sortOrder = sortOrder;
            this._currentPage = 1;
            await this.updateGames();
        };

        this._filterControls.onFilterChange = async (minPrice: number, maxPrice: number, tagIds: number[]) => {
            this._minPrice = minPrice;
            this._maxPrice = maxPrice;
            this._selectedTags = tagIds;
            this._currentPage = 1;
            await this.updateGames();
        };
    }

    private async updateGames(): Promise<void> {
        if (!this.shadowRoot || !this._sortingControls || !this._gamesContainer || !this._paginationContainer) {
            return;
        }

        const paginatedResponse: PaginatedResponse<Game> = await this._gameService.getGames(
            this._currentPage,
            this._itemsPerPage,
            this._sortOrder,
            this._sortBy as "name" | "price" | "created",
            this._selectedTags,
            this._minPrice,
            this._maxPrice
        );

        const games: Game[] = paginatedResponse.items;
        this._totalPages = paginatedResponse.pagination.totalPages;
        this._currentPage = paginatedResponse.pagination.currentPage;
        this._itemsPerPage = paginatedResponse.pagination.itemsPerPage;
        this._totalItems = paginatedResponse.pagination.totalItems;

        // Clear existing games
        this._gamesContainer.innerHTML = "";
        games.forEach(game => {
            const gameElement: HTMLElement = html`
                <webshop-select-game
                    gameId="${game.id}"
                    name="${game.name}"
                    image="${game.thumbnail}"
                    price="${game.price}"
                ></webshop-select-game>
            `;

            this._gamesContainer!.appendChild(gameElement);
        });

        this._sortingControls.totalResults = this._totalItems;

        const pageButtons: HTMLButtonElement[] = [];

        const startPage: number = Math.max(1, this._currentPage - 1);
        const endPage: number = Math.min(this._totalPages, startPage + 2);

        for (let i: number = startPage; i <= endPage; i++) {
            const pageButton: HTMLButtonElement = html`<button>${i}</button>` as HTMLButtonElement;

            if (i === this._currentPage) {
                pageButton.classList.add("active");
            }

            pageButton.addEventListener("click", async () => {
                await this.switchPage(i);
            });

            pageButtons.push(pageButton);
        }

        const prevArrow: HTMLButtonElement = html`<button class="icon"><img src="images/icons/arrow-left.svg"></button>` as HTMLButtonElement;
        prevArrow.disabled = this._currentPage === 1;
        prevArrow.addEventListener("click", async () => {
            await this.switchPage(this._currentPage - 1);
        });

        const nextArrow: HTMLButtonElement = html`<button class="icon"><img src="images/icons/arrow-right.svg"></button>` as HTMLButtonElement;
        nextArrow.disabled = this._currentPage === this._totalPages;
        nextArrow.addEventListener("click", async () => {
            await this.switchPage(this._currentPage + 1);
        });

        // Clear existing pagination
        this._paginationContainer.innerHTML = "";
        this._paginationContainer.appendChild(prevArrow);
        pageButtons.forEach(button => {
            this._paginationContainer!.appendChild(button);
        });
        this._paginationContainer.appendChild(nextArrow);
    }

    private async switchPage(page: number): Promise<void> {
        if (page < 1 || page > this._totalPages) {
            return;
        }

        if (this._currentPage === page) {
            return;
        }

        this._currentPage = page;
        await this.updateGames();
    }
}

window.customElements.define("webshop-list-games", GameListComponent);
