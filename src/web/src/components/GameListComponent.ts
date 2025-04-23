import "@web/components/GameSelectComponent";
import { Game } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { GameService } from "@web/services/GameService";

class GameListComponent extends HTMLElement {
    private _gameService: GameService = new GameService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const games: Game[] = await this._gameService.getGames();

        const styles: HTMLElement = html`
            <style>
                .games {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="games">
                ${games.map(game => html`
                    <webshop-select-game
                        id="${game.id}"
                        name="${game.name}"
                        image="${game.thumbnail}"
                    ></webshop-select-game>
                `)}
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-list-games", GameListComponent);
