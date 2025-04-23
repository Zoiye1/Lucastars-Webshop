import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
import { GameService } from "@web/services/GameService";
import { IGameService } from "@web/interfaces/IGameService";
import { Game } from "@shared/types";
/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class GameInfoComponent extends HTMLElement {
    private gameService: IGameService = new GameService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const params: URLSearchParams = new URLSearchParams(window.location.search);
        const name: string | null = params.get("name");
        let game: Game[] = [];
        if (name) {
            game = await this.gameService.getGameByName(name);
        }

        const styles: HTMLElement = html`
            <style>
                .container {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                }

                .container header {
                    margin-left: 85px;
                    margin-top: 100px;
                    width: 100%;
                }

                .container header h2 {
                    margin-bottom: 10px;
                }

                .container header img {
                    width: 25px;
                }

                .image-container {
                    margin-top: 20px;
                    margin-left: 85px;
                    height: 350px;
                    width: 350px;
                    border: 1px solid black;
                    border-radius: 25px;
                    
                    background: black;
                    
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .image-container img {
                    width: 100%;
                }

                .game-info {
                    margin-left: 280px;
                    width: 300px;
                    height: 450px;
                }

                .game-info .price {
                    color: #ff2b2b;
                    font-size: 23px;
                    text-align: center;
                    font-weight: bold;
                }

                .game-info .description {
                    margin: 0 50px;
                }

                .quantity-selector {
                    width: 100%;
                }

                .quantity {
                    margin-top: 60px;
                    margin-left: 50px;
                    width: 50px;
                    height: 50px;
                    border: 2px solid black;
                    border-radius: 10px;
                    display: none;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                }

                .cart-button {
                    margin-top: 80px;
                    margin-left: 50px;
                    width: 200px;
                    height: 50px;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    background: #159eff;
                    color: white;
                }

                .cart-button:hover {
                    background: #1083d5;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="container">
                <header>
                    <h2>${game[0].name}</h2>
                    <div class="stars-container">
                        <div class="star">
                            <img src="/images/icons/star-full.svg" alt="Stars Logo" />
                            <img src="/images/icons/star-full.svg" alt="Stars Logo" />
                            <img src="/images/icons/star-full.svg" alt="Stars Logo" />
                            <img src="/images/icons/star-full.svg" alt="Stars Logo" />
                            <img src="/images/icons/star-full.svg" alt="Stars Logo" />
                        </div>
                    </div>
                </header>
                <div class="image-container">
                    <img src="${game[0].thumbnail}" alt="game-cover" />
                </div>
                <div class="game-info">
                    <p class="price">${game[0].price}</p>
                    <p class="description">${game[0].description}</p>
                    <div class="quantity-selector">
                        <div class="quantity">1x</div>
                    </div>
                    <div class="cart-button">In winkelwagen</div>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-game-info", GameInfoComponent);
