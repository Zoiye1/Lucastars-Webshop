import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
import { Game } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";
import { GameService } from "@web/services/GameService";
/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class BannerComponent extends HTMLElement {
    private _gameService: IGameService = new GameService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) return;

        // Show temporary "loading" content
        this.shadowRoot.innerHTML = "<p>Loading featured games...</p>";

        const games: Game[] | undefined = await this._gameService.getFiveRandomGames();

        if (games.length === 0) {
            this.shadowRoot.innerHTML = "<p>No games found.</p>";
            return;
        }

        // Now continue rendering actual content after data has arrived
        const styles: HTMLElement = html`
            <style>
                *, body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                }
                .banner-section {
                    margin-top: 30px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .banner-title {
                    width: 80%;
                    margin: 20px 0;
                }
                .featured-games-container {
                    font-weight: bold;
                    width: 940px;
                    position: relative;
                    height: 353px;

                    display: flex;
                    justify-content: space-between;
                    box-shadow: 0px 0px 9px -4px black;
                    background: white;
                    border-radius: 30px;
                }
                .big-picture {
                    height: 100%;
                    width: 616px;

                }
                .big-picture img {
                    width: 100%;
                    height: 100%;

                    object-fit: cover; 
                    object-position: center; 
                    display: block;
                    border-top-left-radius: 30px;
                    border-bottom-left-radius: 30px;
                }
                .game-details {
                    width: 324px;
                }
                .title {
                    margin: 15px 0;
                    text-align: center;
                    padding: 0 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .small-pictures {
                    width: 100%;
                    height: 200px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    flex-direction: column;
                }
                
                .small-pictures a {
                    width: 45%;
                    height: 45%;
                    margin: 0 5px;
                    
                    text-decoration: none;
                    color: black;
                }

                .small-picture {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .small-picture p {
                    position: absolute;
                    background: #f07a33d9;
                    padding: 3px 11px 3px 3px;
                    color: white;
                    bottom: 0;
                    font-weight: bold;
                    border-top-right-radius: 30px;
                }

                .small-picture h5 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .small-pictures img {
                    width: 100%;
                    height: 100%;

                    object-fit: cover; 
                    object-position: center; 
                    display: block;
                }
                .status {
                    background: #000;
                    color: white;
                    padding: 5px 10px;
                    display: inline-block;
                    margin-left: 10px;
                    font-size: 13px;
                    margin-top: 27px;
                }

                .price {
                    margin-top: 15px;
                    margin-left: 10px;
                }

                .buttons-container {
                    width: 940px;
                    display: flex;
                    justify-content: space-evenly;
                    margin: 12px 0;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <section class="banner-section" id="banner-section">
                <h1 class="banner-title">Topaanbevelingen</h1>
                <div class="featured-games-container">
                    <a href="/game-info.html?id=${games[0].id}">
                        <div class="big-picture">
                            <img alt="Main Screenshot of Game" src="${games[0].thumbnail}" />
                        </div>
                    </a>
                    <div class="game-details">
                        <h2 class="title">${games[0].name}</h2>
                        <div class="small-pictures">
                            <a href="/game-info.html?id=${games[1].id}">
                                <div class="small-picture">
                                    <img alt="Main Screenshot of Game" src="${games[1].thumbnail}" />
                                    <h5>${games[1].name}</h5>
                                    <p>Avontuur</p>
                                </div>
                            </a>
                            <a href="/game-info.html?id=${games[2].id}">
                                <div class="small-picture">
                                    <img alt="Main Screenshot of Game" src="${games[2].thumbnail}" />
                                    <h5>${games[2].name}</h5>
                                    <p>Actie</p>
                                </div>
                            </a>
                            <a href="/game-info.html?id=${games[3].id}">
                                <div class="small-picture">
                                    <img alt="Main Screenshot of Game" src="${games[3].thumbnail}" />
                                    <h5>${games[3].name}</h5>
                                    <p>Fantasie</p>
                                </div>
                            </a>
                            <a href="/game-info.html?id=${games[4].id}">
                                <div class="small-picture">
                                    <img alt="Main Screenshot of Game" src="${games[4].thumbnail}" />
                                    <h5>${games[4].name}</h5>
                                    <p>Horror</p>
                                </div>
                            </a>

                        </div>
                        <h3 class="status">Hoogste reviews</h3>
                        <p class="price">${games[0].price}</p>
                    </div>
                </div>
                <div class="buttons-container">
                    <webshop-link-button>Mijn games</webshop-link-button>
                    <webshop-link-button>Shop nu!</webshop-link-button>
                </div>
            </section>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-banner", BannerComponent);
