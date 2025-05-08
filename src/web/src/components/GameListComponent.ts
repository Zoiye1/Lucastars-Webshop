import "@web/components/GameSelectComponent";
import { Game, PaginatedResponse } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { GameService } from "@web/services/GameService";

class GameListComponent extends HTMLElement {
    private _gameService: GameService = new GameService();
    private _currentPage: number = 1;
    private _totalPages: number = 1;
    private _itemsPerPage: number = 15;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const paginatedResponse: PaginatedResponse<Game> = await this._gameService.getGames(this._currentPage, this._itemsPerPage);
        const games: Game[] = paginatedResponse.items;
        this._totalPages = paginatedResponse.pagination.totalPages;
        this._currentPage = paginatedResponse.pagination.currentPage;
        this._itemsPerPage = paginatedResponse.pagination.itemsPerPage;

        const styles: HTMLElement = html`
            <style>
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
            </style>
        `;

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

        const element: HTMLElement = html`
            <div>
                <div class="games">
                    ${games.map(game => html`
                        <webshop-select-game
                            gameId="${game.id}"
                            name="${game.name}"
                            image="${game.thumbnail}"
                            price="${game.price}"
                        ></webshop-select-game>
                    `)}
                </div>
                <div class="pagination-container">
                    <div class="pagination">
                        ${prevArrow}
                        ${pageButtons}
                        ${nextArrow}
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }

    private async switchPage(page: number): Promise<void> {
        if (page < 1 || page > this._totalPages) {
            return;
        }

        if (this._currentPage === page) {
            return;
        }

        this._currentPage = page;
        await this.render();
    }
}

window.customElements.define("webshop-list-games", GameListComponent);
