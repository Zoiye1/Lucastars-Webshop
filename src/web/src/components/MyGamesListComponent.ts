import { html } from "@web/helpers/webComponents";
import { Game } from "@shared/types";
import { GameService } from "@web/services/GameService";
import "@web/components/GameSelectComponent";

export class MyGamesListComponent extends HTMLElement {
    private _gameService: GameService = new GameService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const games: Game[] = await this._gameService.getOwnedGames();
        // const games: Game[] = await this._gameService.getGames();

        if (games.length === 0) {
            const styles: HTMLElement = html`
                <style>
                    :host {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                    }

                    .no-games {
                        text-align: center;
                        margin: 20px 0;
                        font-size: 18px;
                    }

                    .no-games a {
                        color: #007bff;
                        text-decoration: none;
                    }

                    .no-games a:hover {
                        text-decoration: underline;
                    }
                </style>
            `;

            const element: HTMLElement = html`
                <div class="no-games">
                    <p>Je hebt nog geen games gekocht.</p>
                    <p><a href="/games.html">Bekijk onze spellen</a> en vind er eentje die je leuk lijkt!</p>
                </div>
            `;

            this.shadowRoot.firstChild?.remove();
            this.shadowRoot.append(styles, element);
            return;
        }

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
                        gameId="${game.id}"
                        name="${game.name}"
                        image="${game.thumbnail}"
                        price="${game.price}"
                    ></webshop-select-game>
                `)}
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-my-games-list", MyGamesListComponent);
